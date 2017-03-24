'use strict'

/**
 * The global object
 * @type {object}
 */
gl.splitbox = {}

/**
 * Add a tab
 * @param {string} tpl
 * @param {*?} params
 * @param {string} label
 * @return jQuery
 */
gl.splitbox.tabAdd = function (tpl, params, label) {
  const $li = $('<li role="presentation"><a href="#"><span class="text"></span></a></li>')
  $li.attr('data-template', tpl)
  $li.find('a').append(' <span class="glyphicon glyphicon-remove"></span>')
  $li.find('.text').text(gl.t(label))
  $('.splitbox-tabs .nav-tabs').append($li)
  $li.data('params', params)
  return $li
}

/**
 * Tab delete
 * @param {jQuery} $tab
 */
gl.splitbox.tabDelete = function ($tab) {
  if ($tab.hasClass('active')) {
    $('.splitbox').children().html('')
  }
  $tab.remove()
  gl.splitbox.tabSave()
}

/**
 * On tab click
 * @param {jQuery} $tab
 */
gl.splitbox.tabLoad = function ($tab) {
  const tabs = $tab.parent().children()
  tabs.removeClass('active')
  $tab.addClass('active')
  gl.tpl.loadInto($tab.attr('data-template') + '-left', '.splitbox .left')
  gl.tpl.loadInto($tab.attr('data-template') + '-right', '.splitbox .right')
  const $splitLeft = $('.splitbox .left')
  $splitLeft.css('flex', '0 0 ' + ($tab.data('params').widthLeft || 50) + '%')
}

/**
 * Save current tabs to storage
 */
gl.splitbox.tabSave = function () {
  const tabs = []
  $('.splitbox-tabs li').each(function () {
    tabs.push({
      'template': $(this).attr('data-template'),
      'params': $(this).data('params'),
      'text': $(this).find('.text').text(),
      'active': $(this).hasClass('active')
    })
  })
  gl.storage.set('tabs', tabs)
}

/**
 * Restore tabs from latest save
 */
gl.splitbox.tabRestore = function () {
  const tabs = gl.storage.get('tabs')
  if (tabs) {
    for (let i = 0; i < tabs.length; i++) {
      const row = tabs[i]
      const $li = gl.splitbox.tabAdd(row.template, row.params, row.text)
      $li.toggleClass('active', row.active)
      if (row.active) {
        gl.splitbox.tabLoad($li)
      }
    }
  }
}

/**
 * Reload current active tab
 */
gl.splitbox.tabReload = function () {
  gl.splitbox.tabLoad($('.splitbox-tabs .active'))
}
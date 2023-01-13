
// reload page after a period of inactivity

// First, go back to the top of the page
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
if (isSafari) {
  document.body.scrollTop = 0 // For Safari
} else {
  document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
}

var timeoutID

function SetupAutoReload () {
  document.addEventListener('mousemove', resetTimer, false)
  document.addEventListener('mousedown', resetTimer, false)
  document.addEventListener('keypress', resetTimer, false)
  document.addEventListener('DOMMouseScroll', resetTimer, false)
  document.addEventListener('mousewheel', resetTimer, false)
  document.addEventListener('touchmove', resetTimer, false)
  document.addEventListener('MSPointerMove', resetTimer, false)

  startTimer()
}

function startTimer () {
// wait 300 seconds before calling refreshPage
  timeoutID = window.setTimeout(refreshPage, 300000)
}

function resetTimer (e) {
  console.log('Resetting timer due to activity.')
  window.clearTimeout(timeoutID)

  startTimer()
}

function refreshPage () {
  window.location.reload()
}

module.exports.SetupAutoReload = SetupAutoReload

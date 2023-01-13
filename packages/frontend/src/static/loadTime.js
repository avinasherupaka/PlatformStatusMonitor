function getTime () {
  var today = new Date()
  var h = today.getHours()
  var m = today.getMinutes()
  var s = today.getSeconds()
  var suffix = (h => 12) ? 'PM' : 'AM'
  h = ((h + 11) % 12 + 1)
  h = checkTime(h)
  m = checkTime(m)
  s = checkTime(s)
    // return "[Data as of " + h + ":" + m + ":" + s + "]";
  document.getElementById('txt').innerHTML = '<small>[Data as of ' + h + ':' + m + ':' + s + ' ' + suffix + ']</small>'
}

function checkTime (i) {
  if (i < 10) { i = '0' + i };  // add zero in front of numbers < 10
  return i
}

module.exports.getTime = getTime

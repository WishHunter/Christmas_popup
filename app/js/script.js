$(document).ready(function () {
	var viewport = 995;
  var imgCont = document.querySelector('.erasable_layer');
  var eraser = document.getElementById('eraser');
  var $eraser = $(eraser);
  var mask = document.getElementById('mask');
  var points = {x: 0, y: 0};
  var draw = false;
  if (screen.width > 991) {
    var brushWidht = 30;
  } else {
    var brushWidht = 30;
  }
  var w;
  var h;
  var ctx;
  var percent;
  var timerId;
  var initId;
  var state = 1;
  var startTime = 0;
  var month = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']
  var date = new Date();
  var date_number = date.getDate();
  var date_month = month[date.getMonth()];

  function eraserInit() {
    if (state !== 1) {
      return;
    }
    w = eraser.width = mask.width = imgCont.offsetWidth;;
    h = eraser.height = mask.height = imgCont.offsetHeight;
    ctx = eraser.getContext('2d');

    if (mask.complete) {
       ctx.drawImage(mask, w / 2 - mask.width / 2, 0, w, h);
        ctx.textBaseline = 'center';
        ctx.textAlign = "center";
        ctx.font = "900 100px 'Tahoma'";
        ctx.fillStyle = "#fff";
        ctx.fillText(date_number, w/2-5, h/2+20);
        ctx.textBaseline = 'top';
        ctx.textAlign = "center";
        ctx.font = "bold 18px 'Tahoma'";
        ctx.fillStyle = "rgba(255,255,255,.58)";
        ctx.fillText(date_month, w/2, h-40);
        clearInterval(initId);        
    } else {
      initId = setInterval(eraserInit, 100);
    }
  }

  function showPercentage() {
    var length = w * h;
    var data = new Int32Array(ctx.getImageData(0, 0, w, h).data.buffer);
    for (var i = length, j = 0; i; i--) {
      if (data[i] !== 0) {
        j++;
      }
    }
    percent = (j / length * 100).toFixed(2);
  }
  function eraserMouseDownHandler(e) {
    var offset = 10;
    if (viewport < 991) {
      offset = 0;
    }
    points.x = e.offsetX || e.originalEvent.targetTouches["0"].pageX - $(e.target).offset().left;
    points.y = e.offsetY || e.originalEvent.targetTouches["0"].pageY - $(e.target).offset().top;
    draw = true;
    ctx.beginPath();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.moveTo(points.x + offset, points.y + offset);
  }

  function eraserMouseUpHandler(e) {
    var offset = 10;
    if (viewport < 991) {
      offset = 0;
    }
    e.preventDefault();
    points.x = e.offsetX || e.originalEvent.changedTouches["0"].pageX - $(e.target).offset().left;
    points.y = e.offsetY || e.originalEvent.changedTouches["0"].pageY - $(e.target).offset().top;
    ctx.lineTo(points.x + offset, points.y + offset);
    ctx.stroke();
    ctx.closePath();
    showPercentage();
    draw = false;
    if (percent < 50) {
      $('#eraser').fadeOut();
			setTimeout(function() { $('.christmas_calendar_popup').fadeOut();}, 2000);  	
    }
  }
  
  function eraserMouseMoveHandler(e) {
    var offset = 10;
    if (viewport < 991) {
      offset = 0;
    }
    e.preventDefault();
    if (draw === true) {
      points.x = e.offsetX || e.originalEvent.targetTouches["0"].pageX - $(e.target).offset().left;
      points.y = e.offsetY || e.originalEvent.targetTouches["0"].pageY - $(e.target).offset().top;
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = brushWidht;
      ctx.lineTo(points.x + offset, points.y + offset);
      ctx.stroke();
      showPercentage();
      if (percent < 50) {
        $('#eraser').fadeOut();
				setTimeout(function() { $('.christmas_calendar_popup').fadeOut();}, 2000);  
      }
    }
  }
  $(window).on('resize', function () {
    eraserInit();
    viewport = window.innerWidth;
  });
  eraserInit();
  $eraser.on("mousedown touchstart", eraserMouseDownHandler)
      .on("mousemove touchmove", eraserMouseMoveHandler)
      .on("mouseup touchend", eraserMouseUpHandler)
      .addClass('eraser');
  $('.close_christmas_calendar_popup').on('click', function () {
	$('.christmas_calendar_popup').fadeOut();
	});
	$('.date_tomorrow').html(date_number + 1);
	$('.date_tomorrow_month').html(date_month);
});



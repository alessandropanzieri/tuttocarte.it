$(() => {
    var hand, timer, clicks = 0, zIndex = 0, highestZIndex = 0;
    const room = window.location.pathname.slice(1), socketio = io({ transport: ["websocket"] });

    socketio.on("connect", function () {
        socketio.emit("join", { room });
    });

    socketio.on("join", function (data) {
        socketio.emit("play", { user: data.user, html: $("#table").html() });
    });

    socketio.on("play", function (data) {
        $("#table").html(data.html);
    });

    socketio.on("turn", function (data) {
        $(`#${data.id}`).attr(
            "src",
            $(`#${data.id}`).attr("src").startsWith("static/assets/decks/")
                ? `static/assets/backs/${$(`#${data.id}`)[0].classList[0]}.jpg`
                : `static/assets/decks/${$(`#${data.id}`)[0].classList[0]}/${data.value}`
        );
    });

    socketio.on("hand", function (data) {
        $("#table").html(data.html + `<img id = "hand-icon" src = "static/assets/other/hand.png" height = "50px" style = "z-index: 3; position: absolute; top: ${data.hand.top}; left: ${data.hand.left};" alt = "hand-icon">`);
        $("#hand-icon").fadeOut(1500, function () {
            $(this).remove();
        });
    })

    $("#table").on("click", ".card", function () {
        clicks++;
        that = $(this);

        if (clicks === 1) {
            timer = setTimeout(function () {
                socketio.emit("turn", { room, id: that.attr("id") });
                clicks = 0;
            }, 300);
        } else {
            clearTimeout(timer);
            that.draggable("destroy");
            hand = { top: that.css("top"), left: that.css("left") };
            $("#hand div").prepend(that.css({ "top": "0", "left": "0" }));
            socketio.emit("hand", { room, html: $("#table").html(), hand: hand });
            clicks = 0;
        }
    });

    $("#hand").on("click", ".card", function () {
        socketio.emit("turn", { id: that.attr("id") });
    });

    function getHighestZIndex($container) {
        $container.children().each(function () {
            zIndex = parseInt($(this).css("z-index"), 10);
            zIndex > highestZIndex ? highestZIndex = zIndex : null;
        });
        return highestZIndex;
    }

    $("#table").on("touchstart mouseenter", ".card, .fiche, #board, .chess, .dama", function () {
        $(this).draggable({
            start: function () {
                $(this).css({ "cursor": "grabbing", "z-index": getHighestZIndex($("#table")) + 1 });
                if ($(this).hasClass("clonable")) {
                    $(this).clone().appendTo("#table");
                    $(this).removeClass("clonable");
                }
            },
            drag: function () {
                socketio.emit("play", { room, html: $("#table").html() });
            },
            stop: function () {
                $(this).css({ "cursor": "pointer" });
            }
        });
    });

    $("#hand").on("touchstart mouseenter", ".card", function () {
        $(this).draggable({
            containment: "#table",
            start: function () {
                $(this).css({ "z-index": 2, "cursor": "grabbing" });
            },
            stop: function () {
                $(this).appendTo($("#table")).draggable("destroy").css({
                    "z-index": 1,
                    "cursor": "pointer",
                    "left": (parseFloat($(this).css("left"), 10) + ($("h5").width() + 9.800)) + "px",
                    "top": ($("#table").height() - (50 + (- parseFloat($(this).css("top"), 10) - 80.065))) + "px"
                });
                socketio.emit("play", { room, html: $("#table").html() });
            }
        });
    });
});
$(() => {
    const room = window.location.pathname.slice(1), socketio = io({ transport: ["websocket"] });

    socketio.on("connect", function () { socketio.emit("join", { room }); });
    socketio.on("join", function (data) { socketio.emit("play", { user: data.user, html: $("#table").html() }); });
    socketio.on("play", function (data) { $("#table").html(data.html); });
    socketio.on("turn", function (data) {
        $(`#${data.id}`).attr(
            "src",
            $(`#${data.id}`).attr("src").startsWith("static/assets/decks/")
                ? `static/assets/backs/${$(`#${data.id}`)[0].classList[0]}.png`
                : `static/assets/decks/${$(`#${data.id}`)[0].classList[0]}/${data.value}`
        );
    });
    socketio.on("hand", function (data) {
        $("#table").html(data.html + `<img id = "hand-icon" src = "static/assets/other/hand.png" height = "50px" style = "position: absolute; left: ${data.position.x}; top: ${data.position.y}; z-index: ${data.position.z}" alt = "hand-icon">`);
        $("#hand-icon").fadeOut(1500, function () {
            $(this).remove();
        });
    })

    $("#table *:not(#share)").draggable({
        delay: 300,
        stack: "#table *",
        cursor: "grabbing",
        containment: "#table",
        start: function () {
            if ($(this).hasClass("clonable")) {
                $(this).removeClass("clonable");
                $(this).clone().appendTo("#table");
            }
        },
        drag: function () { socketio.emit("play", { room, html: $("#table").html() }); }
    });

    $("#table").on("click tap", ".card", function () {
        socketio.emit("turn", { room, id: $(this).attr("id") });
    });

    $("#table").on("dblclick taphold", ".card", function () {
        var position = { x: $(this).css("left"), y: $(this).css("top"), z: $(this).css("z-index") };
        $("#hand").prepend(
            $(this).draggable({
                stack: "#table *",
                cursor: "grabbing",
                containment: "#table",
                stop: function () {
                    $(this).appendTo("#table");
                    socketio.emit("play", { room, html: $("#table").html() });
                }
            })
        );
        socketio.emit("hand", { room, html: $("#table").html(), position: position });
    });

    $("#hand").on("click, tap", ".card", function () { socketio.emit("turn", { id: $(this).attr("id") }); });
});
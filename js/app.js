document.addEventListener("DOMContentLoaded", async () => {

    await loadRooms();

    initializeYearMonth();

    initializeCalendar();

    moveCalendar();

    await loadReservations();

});

async function loadRooms() {

    const roomSelect =
        document.getElementById("roomSelect");

    const { data, error } =
        await supabaseClient
            .from("rooms")
            .select("*")
            .order("display_order");

    if (error) {

        console.error(error);

        roomSelect.innerHTML =
            "<option>取得失敗</option>";

        return;
    }

    roomSelect.innerHTML = "";

    data.forEach(room => {

        const option =
            document.createElement("option");

        option.value = room.id;
        option.textContent = room.room_name;

        roomSelect.appendChild(option);

    });

    roomSelect.addEventListener("change", async () => {
        await loadReservations();
    });

}

function initializeYearMonth() {

    const yearSelect =
        document.getElementById("yearSelect");

    const monthSelect =
        document.getElementById("monthSelect");

    const now = new Date();

    const y = now.getFullYear();
    const m = now.getMonth() + 1;

    for (let i = y - 2; i <= y + 2; i++) {

        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = i;
        opt.selected = (i === y);

        yearSelect.appendChild(opt);
    }

    for (let i = 1; i <= 12; i++) {

        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = i;
        opt.selected = (i === m);

        monthSelect.appendChild(opt);
    }

    yearSelect.addEventListener("change", moveCalendar);
    monthSelect.addEventListener("change", moveCalendar);
}

function moveCalendar() {

    if (!window.calendar) return;

    const y =
        document.getElementById("yearSelect").value;

    const m =
        document.getElementById("monthSelect").value;

    calendar.gotoDate(`${y}-${String(m).padStart(2,"0")}-01`);
}

async function loadReservations() {

    const roomId =
        document.getElementById("roomSelect").value;

    const { data, error } =
        await supabaseClient
            .from("reservations")
            .select("*")
            .eq("room_id", roomId);

    if (error) {
        console.error(error);
        return;
    }

    calendar.removeAllEvents();

    data.forEach(r => {

        calendar.addEvent({

            id: r.id,

            start:
                `${r.reserve_date}T${r.start_time}`,

            end:
                `${r.reserve_date}T${r.end_time}`,

            extendedProps: {
                user_name: r.user_name
            }

        });

    });

}

async function addReservation(
    reserveDate,
    userName,
    startTime,
    endTime
) {

    const roomId =
        document.getElementById("roomSelect").value;

    const { error } =
        await supabaseClient
            .from("reservations")
            .insert([{
                room_id: roomId,
                reserve_date: reserveDate,
                start_time: startTime,
                end_time: endTime,
                user_name: userName
            }]);

    if (error) {

        alert("登録失敗\n" + error.message);
        return;
    }

    await loadReservations();

    alert("登録しました");
}
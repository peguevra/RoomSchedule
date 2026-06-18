initializeCalendar() {

    const calendarEl =
        document.getElementById("calendar");

    calendar =
        new FullCalendar.Calendar(calendarEl, {

            locale: "ja",

            initialView: "dayGridMonth",

            height: "auto",

            // ★追加（ヘッダー簡素化）
            headerToolbar: {
                left: "title",
                center: "",
                right: ""
            },

            // ★追加（日付番号を非表示）
            dayCellContent: function(arg) {
                return "";   // ← これで日付数字消える
            },

            dateClick: async function(info) {

                const userName =
                    prompt("名前を入力してください");

                if (!userName) return;

                const startTime =
                    await createTimeSelector("開始時間");

                if (!startTime) return;

                const endTime =
                    await createTimeSelector("終了時間");

                if (!endTime) return;

                await addReservation(
                    info.dateStr,
                    userName,
                    startTime,
                    endTime
                );
            },

            eventClick: function(info) {

                const e = info.event;

                const name =
                    e.extendedProps.user_name;

                const start =
                    e.start.toTimeString().substring(0,5);

                const end =
                    e.end.toTimeString().substring(0,5);

                alert(
                    "予約詳細\n\n" +
                    name + "\n" +
                    start + "-" + end
                );
            },

            eventContent: function(arg) {

                const e = arg.event;

                const name =
                    e.extendedProps.user_name ?? "";

                const start =
                    e.start.toTimeString().substring(0,5);

                const end =
                    e.end.toTimeString().substring(0,5);

                return {
                    html:
                        `<div class="event-box">` +
                        `${name} ${start}-${end}` +
                        `</div>`
                };
            }
        });

    calendar.render();

    window.calendar = calendar;
}
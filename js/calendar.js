let calendar;

function initializeCalendar() {

    const calendarEl =
        document.getElementById("calendar");

    calendar =
        new FullCalendar.Calendar(
            calendarEl,
            {
                locale: "ja",
                initialView: "dayGridMonth",
                height: "auto",

                dayCellContent: function(arg) {
                    return arg.dayNumberText.replace("日", "");
                },

                dateClick: async function(info) {

                    showReservationModal(
                        info.dateStr
                    );

                },

                eventClick: function(info) {

                    const e = info.event;

                    const name =
                        e.extendedProps.user_name;

                    const start =
                        e.start.toTimeString().substring(0, 5);

                    const end =
                        e.end.toTimeString().substring(0, 5);

                    alert(
                        "予約詳細\n\n" +
                        "名前：" + name + "\n" +
                        "時間：" + start + " - " + end
                    );

                },

                eventContent: function(arg) {

                    const e = arg.event;

                    const name =
                        e.extendedProps.user_name ?? "";

                    const start =
                        e.start.toTimeString().substring(0, 5);

                    const end =
                        e.end.toTimeString().substring(0, 5);

                    return {
                        html:
                            `<div class="event-box">` +
                            `${name} ${start}-${end}` +
                            `</div>`
                    };

                }
            }
        );

    calendar.render();

    window.calendar = calendar;
}

function showReservationModal(reserveDate) {

    const overlay =
        document.createElement("div");

    overlay.className =
        "modal-overlay";

    overlay.innerHTML = `

        <div class="modal-box">

            <h3>予約登録</h3>

            <div class="form-row">
                <label>名前</label>
                <input
                    type="text"
                    id="reserveName">
            </div>

            <div class="form-row">
                <label>開始時間</label>
                <select id="startTime"></select>
            </div>

            <div class="form-row">
                <label>終了時間</label>
                <select id="endTime"></select>
            </div>

            <div class="button-row">
                <button id="saveBtn">
                    登録
                </button>

                <button id="cancelBtn">
                    キャンセル
                </button>
            </div>

        </div>

    `;

    document.body.appendChild(
        overlay
    );

    const startSelect =
        document.getElementById(
            "startTime"
        );

    const endSelect =
        document.getElementById(
            "endTime"
        );

    for (let h = 0; h < 24; h++) {

        for (let m of [0, 30]) {

            const hhmm =
                String(h).padStart(2, "0")
                + ":"
                + String(m).padStart(2, "0");

            startSelect.add(
                new Option(
                    hhmm,
                    hhmm
                )
            );
        }
    }

    function rebuildEndTimes() {

        const start =
            startSelect.value;

        endSelect.innerHTML = "";

        for (let h = 0; h < 24; h++) {

            for (let m of [0, 30]) {

                const hhmm =
                    String(h).padStart(2, "0")
                    + ":"
                    + String(m).padStart(2, "0");

                if (
                    hhmm <= start
                ) continue;

                endSelect.add(
                    new Option(
                        hhmm,
                        hhmm
                    )
                );
            }
        }
    }

    rebuildEndTimes();

    startSelect.addEventListener(
        "change",
        rebuildEndTimes
    );

    document
        .getElementById(
            "cancelBtn"
        )
        .onclick = () => {

            overlay.remove();

        };

    document
        .getElementById(
            "saveBtn"
        )
        .onclick = async () => {

            const userName =
                document
                    .getElementById(
                        "reserveName"
                    )
                    .value
                    .trim();

            if (!userName) {

                alert(
                    "名前を入力してください"
                );

                return;
            }

            const startTime =
                startSelect.value;

            const endTime =
                endSelect.value;

            await addReservation(
                reserveDate,
                userName,
                startTime,
                endTime
            );

            overlay.remove();

        };
}
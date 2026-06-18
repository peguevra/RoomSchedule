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

                // 「1日」→「1」
                dayCellContent: function(arg) {

                    return arg.dayNumberText.replace("日", "");

                },

                // 日付タップ → 予約登録
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

                // 予約タップ → 詳細表示
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

                // イベント表示
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

/**
 * 30分刻み時間選択
 */
function createTimeSelector(labelText) {

    return new Promise(resolve => {

        const wrapper =
            document.createElement("div");

        wrapper.style.position = "fixed";
        wrapper.style.top = "30%";
        wrapper.style.left = "50%";
        wrapper.style.transform =
            "translate(-50%, -50%)";

        wrapper.style.background = "#fff";
        wrapper.style.padding = "20px";
        wrapper.style.border = "1px solid #ccc";
        wrapper.style.borderRadius = "8px";
        wrapper.style.zIndex = "9999";

        const label =
            document.createElement("div");

        label.textContent = labelText;
        label.style.marginBottom = "10px";

        const select =
            document.createElement("select");

        select.style.fontSize = "18px";
        select.style.padding = "8px";

        for (let h = 0; h < 24; h++) {

            for (let m of [0, 30]) {

                const hhmm =
                    String(h).padStart(2, "0") +
                    ":" +
                    String(m).padStart(2, "0");

                const option =
                    document.createElement("option");

                option.value = hhmm;
                option.textContent = hhmm;

                select.appendChild(option);

            }
        }

        const button =
            document.createElement("button");

        button.textContent = "決定";
        button.style.marginLeft = "10px";

        button.onclick = () => {

            const value = select.value;

            document.body.removeChild(wrapper);

            resolve(value);

        };

        wrapper.appendChild(label);
        wrapper.appendChild(select);
        wrapper.appendChild(button);

        document.body.appendChild(wrapper);

    });

}
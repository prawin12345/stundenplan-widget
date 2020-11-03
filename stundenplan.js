// Stundenplan
//
// originally created by marco79
// modified by Prawin
//
// Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.

const widget = new ListWidget();
const next = await nextLesson();
await createWidget()

if (!config.runsInWidget) {
    await widget.presentSmall()
}
Script.setWidget(widget)
Script.complete()

//build Widget content
async function createWidget() {

    widget.setPadding(10, 10, 10, 10);

    widget.addSpacer(4);
    const logoImg = await getImage('logo.png');

    const logoStack = widget.addStack()
    logoStack.addSpacer(86)
    const logoImageStack = logoStack.addStack()
    logoStack.layoutHorizontally()
    logoImageStack.backgroundColor = new Color("#00000", 1.0);
    logoImageStack.cornerRadius = 8
    const wimg = logoImageStack.addImage(logoImg)
    wimg.imageSize = new Size(40, 40)
    wimg.rightAlignImage()
    widget.addSpacer()

    let column = row.addStack()
    column.layoutVertically()

    const paperText = column.addText("nächte Lektion");
    paperText.font = Font.mediumRoundedSystemFont(13)

    const packageCount = column.addText(next.lesson);
    packageCount.font = Font.mediumRoundedSystemFont(22)
    packageCount.textColor = new Color("#00CD66");
    widget.addSpacer(4)

    const row2 = widget.addStack()
    row2.layoutVertically()

    const remaining = row2.addText(next.remaining);
    remaining.font = Font.regularSystemFont(11);

    const time = row2.addText(next.time);
    time.font = Font.regularSystemFont(11);

}



//next Lesson (same code as /app/stunde.js)
async function nextLesson() {

    var lessons = [
        ["M 415", "M 415", "F 415", "AM 415", "Mittag","C 412", "C 412", "D 415"],
        ["bp 326", "bp 326", "Ph 342", "F 501", "Gg 501", "Mittag","C 410", "B/IT 425", "B/IT 425"],
        ["BG 627", "BG 627", "E 419", "Ph 342", "M 518"],
        ["Ph 342", "AM 415", "T F", "T F", "D 415", "Mittag","Gg 415", "E 415", "F 415"],
        ["T H", "M 415", "D 415", "D 415", "+ 415", "Mittag", "Ph 342", "E 415"]
    ];
    const times = [465, 520, 575, 635, 690, 745, 800, 855, 910];

    const currentDate = new Date();
    var currentDay = currentDate.getDay() - 1;
    var startingIndex = lessons
        .map(dayArray => dayArray.length)
        .splice(0, currentDay)
        .reduce((a, b) => a+b, 0);

    var currentTime = 60 * currentDate.getHours() + currentDate.getMinutes();
    if (currentDay == -1 || currentDay == 6) currentDay = 0, currentTime = 0;
    var dayIndex = times.findIndex(lessonTime => (lessonTime > currentTime));
    if (dayIndex == -1) dayIndex++, startingIndex += lessons[currentDay].length;
    var index = startingIndex + dayIndex;

    const labelTime = (lessonTime) => {
        let diff = lessonTime - currentTime;
        switch (true) {
            case (diff < 0): return "morgen";
            case (diff < 60): return `in ${diff}min`;
            default: return `in ${(diff / 60) | 0}h ${diff % 60}min`;
        }
    }

    return {
        lesson: lessons.flat()[index],
        remaining: labelTime(times[index]),
        time: `${(times[index]/60) | 0}:${times[index] % 60}`,
    }
}

// get images from local filestore or download them once
async function getImage(image) {
    let fm = FileManager.local()
    let dir = fm.documentsDirectory()
    let path = fm.joinPath(dir, image)
    if (fm.fileExists(path)) {
        return fm.readImage(path)
    } else {
        // download once
        let imageUrl
        switch (image) {
            case 'logo.png':
                imageUrl = "https://prawin.gq/favicon.png";
                break
            default:
                console.log(`Sorry, couldn't find ${image}.`);
        }
        let iconImage = await loadImage(imageUrl)
        fm.writeImage(path, iconImage)
        return iconImage
    }
}

// helper function to download an image from a given url
async function loadImage(imgUrl) {
    const req = new Request(imgUrl)
    return await req.loadImage()
}
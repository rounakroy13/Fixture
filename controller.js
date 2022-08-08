function onInit() {
    //document.getElementById("myFixture").style.visibility = "hidden";
}
function fnAddPlayer() {
    var cTable = document.getElementById("mastertable");
    count = cTable.rows.length;
    var cRow = cTable.insertRow(count);
    var cell1 = cRow.insertCell(0);
    var cell2 = cRow.insertCell(1);
    var cell3 = cRow.insertCell(2);
    var cell4 = cRow.insertCell(3);
    var s = document.createElement("h6");
    s.innerHTML = count;
    var x = document.createElement("INPUT");
    x.setAttribute("type", "text");
    x.setAttribute("value", "");
    x.setAttribute('required', '');
    var y = document.createElement("INPUT");
    y.setAttribute("type", "text");
    y.setAttribute("value", "");
    var z = document.createElement("SELECT");
    z.setAttribute("id", "mySelect");
    var option = document.createElement("option");
    option.text = "No Rank";
    z.add(option);
    for (var i = 1; i <= 4; i++) {
        var option = document.createElement("option");
        option.text = i;
        z.add(option);
    }
    z.add(option);
    cell1.appendChild(s);
    cell2.appendChild(x);
    cell3.appendChild(y);
    cell4.appendChild(z);
}

function fnCheckRank() {
    var cTable = document.getElementById("mastertable");
    var array = cTable.rows;
    var remArray = [0, 0, 0, 0, 0];
    for (var i = 1; i < array.length; i++) {
        var iRanked = parseInt(array[i].cells[3].firstElementChild.options[array[i].cells[3].firstElementChild.selectedIndex].value);
        if (iRanked > 0 && iRanked < 5) {
            if (remArray[iRanked] === 1) {
                return true;
            }
            remArray[iRanked] = 1;
        }
    }
    return false;
}

function fnRefersh() {
    location.reload();
}

function fnPrepare() {
    var result = [];
    var draw = [];
    var totalPlayer;
    var cTable = document.getElementById("mastertable");
    count = cTable.rows.length;
    if (fnCheckRank()) {
        alert("Please Select your Ranked players correctly");
        return;
    }
    if (count < 4) {
        alert("Please Add more than 3 Players");
        location.reload();
        return;
    }
    var cTable = document.getElementById("mastertable");
    var array = cTable.rows;
    if (array.length - 1 === 4) {
        totalPlayer = 4;
    } else if (array.length - 1 <= 8) {
        totalPlayer = 8;
    } else if (array.length - 1 <= 16) {
        totalPlayer = 16;
    } else if (array.length - 1 <= 32) {
        totalPlayer = 32;
    } else if (array.length - 1 <= 64) {
        totalPlayer = 64;
    } else {
        alert("Please add Players less than 64");
        return;
    }
    //place ranked player
    for (var i = 1; i < array.length; i++) {
        if (array[i].cells[1].querySelector("input").value === "") {
            alert("Please Provide the Name of all the Players");
            return;
        }
        var rank = parseInt(array[i].cells[3].firstElementChild.options[array[i].cells[3].firstElementChild.selectedIndex].value)
        if (rank > 0 && rank < 5) {
            if (rank === 1) {
                result[1] = array[i].cells[1].querySelector("input").value + " " + array[i].cells[2].querySelector("input").value;
            }
            if (rank === 4) {
                result[totalPlayer / 2] = array[i].cells[1].querySelector("input").value + " " + array[i].cells[2].querySelector("input").value;
            }
            if (rank === 3) {
                result[totalPlayer / 2 + 1] = array[i].cells[1].querySelector("input").value + " " + array[i].cells[2].querySelector("input").value;
            }
            if (rank === 2) {
                result[totalPlayer] = array[i].cells[1].querySelector("input").value + " " + array[i].cells[2].querySelector("input").value;
            }
        } else {
            draw.push(array[i].cells[1].querySelector("input").value + " " + array[i].cells[2].querySelector("input").value);
        }
    }
    //give bye
    var difference = totalPlayer - (array.length - 1);
    if (difference >= 1 && result[1]) {
        result[2] = "BYE";
        difference--;
    }
    if (difference >= 1 && result[totalPlayer]) {
        result[totalPlayer - 1] = "BYE";
        difference--;
    }
    if (difference >= 1 && result[totalPlayer]) {
        result[totalPlayer / 2 + 2] = "BYE";
        difference--;
    }
    if (difference >= 1 && result[totalPlayer]) {
        result[totalPlayer / 2 - 1] = "BYE";
        difference--;
    }
    var giveBye = 2;
    while (difference > 0) {
        if (result[giveBye] === undefined) {
            result[random] = "BYE";
            difference--;
        }
        giveBye += 2;
    }
    //Assign player randomly
    while (draw.length > 0) {
        var random = Math.floor(Math.random() * ((totalPlayer) - 1 + 1) + 1);
        if (result[random] === undefined) {
            result[random] = draw.pop();
        }
    }
    // Flush previous table

    //Preapre Fixture
    var fTable = document.getElementById("fixture");
    var match = 0;
    for (var i = 1; i <= totalPlayer; i ++) {
        if (result[i] === undefined) {
            result[i] = "BYE";
        }
    }
    for (var i = 1; i <= totalPlayer; i += 2) {
        var cRow = fTable.insertRow(fTable.rows.length);
        var cell1 = cRow.insertCell(0);
        var cell2 = cRow.insertCell(1);
        var s = document.createElement("h6");
        match++;
        s.innerHTML = "Match No: " + match;
        cell1.style.width = "50px";
        cell2.style.width = "100px";
        var x = document.createElement("h4");
        x.innerHTML = result[i] + "  vs  " + result[i + 1];
        cell1.appendChild(s);
        cell2.appendChild(x);
    }
    document.getElementById("myFixture").style.visibility = "visible";
}
function fnDownload() {
    html2canvas(document.getElementById('fixture'), {
        onrendered: function (canvas) {
            var data = canvas.toDataURL();
            var docDefinition = {
                content: [{
                    image: data,
                    width: 500
                }]
            };
            pdfMake.createPdf(docDefinition).download("Fixture.pdf");
        }
    });
}

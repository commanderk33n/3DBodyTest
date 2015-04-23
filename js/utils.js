function addMedicament() {
    var counter = getIndex("medicaments") + 1;

    var inputOne = document.createElement("input");
    inputOne.setAttribute("name", "1-MedName" + counter);
    inputOne.setAttribute("type", "text");
    inputOne.setAttribute("placeholder", "Name des Medikaments");

    var inputTwo = document.createElement("input");
    inputTwo.setAttribute("name", "1-MedDose" + counter);
    inputTwo.setAttribute("type", "text");
    inputTwo.setAttribute("placeholder", "Dosis / Menge");

    var inputThree = document.createElement("input");
    inputThree.setAttribute("name", "1-MedUnit" + counter);
    inputThree.setAttribute("type", "text");
    inputThree.setAttribute("placeholder", "Einheit");

    var children = [inputOne, inputTwo, inputThree];
    insertChildren("medicaments", children);
}

function addAllergy() {
    var counter = getIndex("allergies") + 1;

    var inputOne = document.createElement("input");
    inputOne.setAttribute("name", "2-AllergyName" + counter);
    inputOne.setAttribute("type", "text");
    inputOne.setAttribute("placeholder", "Allergiename");

    var inputTwo = document.createElement("select");
    inputTwo.setAttribute("name", "2-AllergyIntensity" + counter);
    inputTwo.setAttribute("size", "1");

    var optionOne = document.createElement("option");
    optionOne.innerHTML = "1 - nicht wahrnehmbar";
    var optionTwo = document.createElement("option");
    optionTwo.innerHTML = "2 - sehr schwach";
    var optionThree = document.createElement("option");
    optionThree.innerHTML = "3 - schwach";
    var optionFour = document.createElement("option");
    optionFour.innerHTML = "4 - mittlere Ausprägung";
    var optionFive = document.createElement("option");
    optionFive.innerHTML = "5 - stark";
    var optionSix = document.createElement("option");
    optionSix.innerHTML = "6 - sehr stark";

    inputTwo.appendChild(optionOne);
    inputTwo.appendChild(optionTwo);
    inputTwo.appendChild(optionThree);
    inputTwo.appendChild(optionFour);
    inputTwo.appendChild(optionFive);
    inputTwo.appendChild(optionSix);

    var inputThree = document.createElement("input");
    inputThree.setAttribute("name", "2-AllergyRegion" + counter);
    inputThree.setAttribute("type", "hidden");
    inputThree.setAttribute("value", "todo");

    var children = [inputOne, inputTwo, inputThree];
    insertChildren("allergies", children);
}

function addPain() {
    var counter = getIndex("pain") + 1;


    var inputOne = document.createElement("input");
    inputOne.setAttribute("name", "3-PainDescription" + counter);
    inputOne.setAttribute("type", "text");
    inputOne.setAttribute("placeholder", "Schmerz-Beschreibung");

    var inputTwo = document.createElement("select");
    inputTwo.setAttribute("name", "3-PainIntensity" + counter);
    inputTwo.setAttribute("size", "1");

    var optionOne = document.createElement("option");
    optionOne.innerHTML = "1 - nicht wahrnehmbar";
    var optionTwo = document.createElement("option");
    optionTwo.innerHTML = "2 - sehr schwach";
    var optionThree = document.createElement("option");
    optionThree.innerHTML = "3 - schwach";
    var optionFour = document.createElement("option");
    optionFour.innerHTML = "4 - mittlere Ausprägung";
    var optionFive = document.createElement("option");
    optionFive.innerHTML = "5 - stark";
    var optionSix = document.createElement("option");
    optionSix.innerHTML = "6 - sehr stark";

    inputTwo.appendChild(optionOne);
    inputTwo.appendChild(optionTwo);
    inputTwo.appendChild(optionThree);
    inputTwo.appendChild(optionFour);
    inputTwo.appendChild(optionFive);
    inputTwo.appendChild(optionSix);

    var inputThree = document.createElement("input");
    inputThree.setAttribute("name", "3-PainRegion" + counter);
    inputThree.setAttribute("type", "hidden");
    inputThree.setAttribute("value", "todo");

    var children = [inputOne, inputTwo, inputThree];
    insertChildren("pain", children);
}

function addInjury() {
    var counter = getIndex("injuries") + 1;

    var inputOne = document.createElement("input");
    inputOne.setAttribute("name", "6-InjuryRegion" + counter);
    inputOne.setAttribute("type", "hidden");
    inputOne.setAttribute("value", "TODO");

    var inputTwo = document.createElement("input");
    inputTwo.setAttribute("name", "6-InjuryDescription" + counter);
    inputTwo.setAttribute("type", "text");
    inputTwo.setAttribute("placeholder", "Verletzungs-Beschreibung");

    var children = [inputOne, inputTwo];
    insertChildren("injuries", children);
}

function addIntoxicants() {
    var counter = getIndex("intoxicants") + 1;

    var inputOne = document.createElement("input");
    inputOne.setAttribute("name", "9-IntoxicantsName" + counter);
    inputOne.setAttribute("type", "text");
    inputOne.setAttribute("placeholder", "Rauschmittelname");

    var inputTwo = document.createElement("input");
    inputTwo.setAttribute("name", "9-IntoxicantsDose" + counter);
    inputTwo.setAttribute("type", "text");
    inputTwo.setAttribute("placeholder", "Menge");

    var inputThree = document.createElement("input");
    inputThree.setAttribute("name", "9-IntoxicantsUnit" + counter);
    inputThree.setAttribute("type", "text");
    inputThree.setAttribute("placeholder", "Einheit");

    var children = [inputOne, inputTwo, inputThree];
    insertChildren("intoxicants", children);
}

function loadMap() {
    var a = document.getElementById("Lat");
    var b = document.getElementById("Long");
    var map = document.getElementById("Map");

    if(a != null && b != null) {
        var lat = a.innerText;
        var long = b.innerText;
        var zoom = 9;
        var success = true;
    }
    else {
        var lat = 51.3167;
        var long = 9.5;
        var zoom = 6;
        var success = false;
    }

    var mapProp = {
        center:new google.maps.LatLng(lat, long),
        zoom:zoom,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };

    window.Map = new google.maps.Map(map, mapProp);
    map.innerHTML = window.Map;
    map.style.width = "100%";
    map.style.height = "500px";

    if(success) {
        addUserLocation(lat, long);
    }

    // Add markers for doctors here after parsing
    var data = parseDoctorData();

    var geocoder = new google.maps.Geocoder();
    for(var i = 0; i < data.length; i++) {
        var doctor = data[i];
        var info = doctor["Title"] + ", " + doctor["Surename"] + doctor["Forename"];
        var address = doctor["Street"] + "," + doctor["HouseNumber"] + "," +  doctor["PostalCode"] +
            "," + doctor["City"];

        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                addMarker(results[0].geometry.location, info, address);
            }
        });
    }
}

function parseDoctorData() {
    var table = document.getElementsByClassName("TableList");
    var trs = table[0].getElementsByTagName("tr");

    var data = new Array();
    for(var i = 1; i < trs.length; i++) {
        var tr = trs[i];

        tds = tr.getElementsByTagName("td");
        var doctor = new Array();

        for(var j = 0; j < tds.length; j++) {
            var td = tds[j];

            if (j == 0) {
                doctor["Title"] = td.innerHTML;
            }
            else if (j == 1) {
                doctor["Forename"] = td.innerHTML;
            }
            else if (j == 2) {
                doctor["Surename"] = td.innerHTML;
            }
            else if (j == 3) {
                doctor["Street"] = td.innerHTML;
            }
            else if (j == 4) {
                doctor["HouseNumber"] = td.innerHTML;
            }
            else if (j == 5) {
                doctor["PostalCode"] = td.innerHTML;
            }
            else if (j == 6) {
                doctor["City"] = td.innerHTML;
            }

        }
        data.push(doctor);
    }

    return data;
}

function addUserLocation(lat, long) {
    var pos = new google.maps.LatLng(lat, long, false);
    var marker = new google.maps.Marker({
        title:'Ihre Position',
        position:pos,
        map:window.Map,
        animation:google.maps.Animation.BOUNCE
    });
}

function addMarker(pos, info, address) {
    var marker = new google.maps.Marker({
        title:name
    });

    var info = new google.maps.InfoWindow({
        content:info + "<br />" + address
    });

    marker.setPosition(pos);
    marker.setMap(window.Map);
    google.maps.event.addListener(marker, 'click', function() {
        info.open(window.Map, marker);
    });
}

function getIndex(id) {
    var name = "#"+id+" :input:text";
    var inputs = $(name);
    var index = 0;
    inputs.each(function() {
        var count = parseInt($(this)[0].getAttribute("name").match(/(\d+)$/)[0], 10);
        index = Math.max(index,count);
    });
    return index;
}

function insertChildren(id, children) {
    var name = "#"+id;
    var div = $(name)[0];
    var button = $(name+" :input:button")[0];
    for(var child in children)
    {
        div.insertBefore(children[child],button);
    }
    div.insertBefore(document.createElement("br"),button);
}
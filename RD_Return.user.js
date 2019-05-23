// ==UserScript==
// @name         RD_Return
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Rettungsdienst zurückalamieren
// @author       You
// @match        https://www.leitstellenspiel.de/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    show_back_btn();

    // extend missionsMarkerAdd
    var original_func = missionMarkerAdd;

    missionMarkerAdd = function(e)
    {
        original_func.apply(this, arguments);
        show_back_btn(e);
    }

    // show share buttons
    function show_back_btn(e)
    {
        var Missions = $('.missionSideBarEntry');
        var added = false;

        for (var i = 0; i < Missions.length; i++)
        {
            var id = 'rdreturn_' + Missions[i].getAttribute('mission_id');

            // check if button is already added
            var children = Missions[i].firstElementChild.firstElementChild.children;

            for(var ci = 0; ci < children.length; ci++)
            {
                if(children[ci].id == id) added = true;
            }

            // if element is not added yet, add it...
            if (added == false)
            {
                var element = create_html_element(Missions[i].getAttribute('mission_id'));
                Missions[i].firstElementChild.firstElementChild.appendChild(element);

                // add click event
                var click_id = "#rdreturn_" + Missions[i].getAttribute('mission_id');
                $(document).on("click", click_id, function(){
                var mission_id = arguments[0].currentTarget.getAttribute("rdreturn_mission_id");

                if(mission_id == undefined) return;

                $.ajax({
                    url: '/missions/' + mission_id + '/backalarmRettungsdienst'
                });

            });
            }
        }

    }

    // create button for sharing...
    function create_html_element(mission_id)
    {
        // build id
        var id = 'rdreturn_' + mission_id;

        // create <a> element
        var a = document.createElement('a');
        a.setAttribute("href", "#");
        a.setAttribute("class", "btn pull-right btn-default btn-xs");
        a.setAttribute("id", id);
        a.setAttribute("margin-left", "5px");
        a.setAttribute("height", "15px");
        a.setAttribute("width", "15px");
        a.setAttribute("rdreturn_mission_id", mission_id);
        a.innerHTML = "RD Return";
        return a;
    }

})();
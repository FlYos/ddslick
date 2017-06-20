// <![CDATA[
$(document).ready(function() {
      //Show or hide source for the demo---
      $("#close-modal").on('click', function() {
            $('#dd-modal').fadeOut();
      });
      //Dropdown plugin data
      var ddData = [{
            text: "Facebook",
            value: "FB",
            description: "Description with Facebook",
            imageSrc: "http://i.imgur.com/XkuTj3B.png"
      }, {
            text: "Twitter",
            value: "TWT",
            description: "Description with Twitter",
            imageSrc: "http://i.imgur.com/8ScLNnk.png"
      }, {
            text: "LinkedIn",
            value: "LI",
            description: "Description with LinkedIn",
            imageSrc: "http://i.imgur.com/aDNdibj.png"
      }, {
            text: "Foursquare",
            value: "FSQ",
            description: "Description with Foursquare",
            imageSrc: "http://i.imgur.com/kFAk2DX.png"
      }];
      //Demo 1---------------------
      $('#demoBasic').ddslick({
            data: ddData,
            width: 300,
            selectText: "Select your favorite social network"
      });
      //Make it slick!
      $('#make-it-slick').on('click', function() {
            $('#demo-htmlselect').ddslick();
      });
      //Restore Original
      $('#restore').on('click', function() {
            $('#demo-htmlselect').ddslick('destroy');
      });
      //Demo 2----------------------
      $('#demoShowSelected').ddslick({
            data: ddData,
            selectText: "Select your favorite social network"
      });
      $('#showSelectedData').on('click', function() {
            var ddData = $('#demoShowSelected').data('ddslick');
            displaySelectedData("2: Getting Selected Dropdown Data", ddData);
      });
      //Demo 3 -------------------------
      $('#demoSetSelected').ddslick({
            data: ddData,
            selectText: "Select your favorite social network"
      });
      $('#btnSetSelected').on('click', function() {
            var i = $('#setIndex').val();
            if (i >= 0 && i < 5)
                  $('#demoSetSelected').ddslick('select', {
                        index: i
                  });
            else
                  $('#setIndexMsg').effect('highlight', 2400);
      });
      //Demo 4--------------------------
      $('#demoCallback').ddslick({
            data: ddData,
            selectText: "Select your favorite social network",
            onSelected: function(data) {
                  displaySelectedData("3: Callback Function on Dropdown Selection", data);
            }
      });
      //Demo 5 -------------------------
      $('#demoDefaultSelection').ddslick({
            data: ddData,
            defaultSelectedIndex: 2
      });
      //Demo 6---------------------------
      $('#demoImageRight').ddslick({
            data: ddData,
            imagePosition: "right",
            selectText: "Select your favorite social network"
      });
      //Demo 7--------------------------
      //Dropdown plugin data
      var ddDataLongDescription = [{
            text: "Facebook",
            value: 1,
            description: "Description with Facebook",
            imageSrc: "http://i.imgur.com/XkuTj3B.png"
      }, {
            text: "Twitter",
            value: 2,
            description: "Twitter is an online social networking service and microblogging service that enables its users to send and read text-based posts of up to 140 characters, known as 'tweets'. It was created in March 2006 by Jack Dorsey and launched that July.",
            imageSrc: "http://i.imgur.com/8ScLNnk.png"
      }, {
            text: "LinkedIn",
            value: 3,
            description: "Description with LinkedIn",
            imageSrc: "http://i.imgur.com/aDNdibj.png"
      }, {
            text: "Foursquare",
            value: 4,
            description: "Description with Foursquare",
            imageSrc: "http://i.imgur.com/kFAk2DX.png"
      }];
      $('#demoTruncated').ddslick({
            data: ddDataLongDescription,
            selectText: "Select your favorite social network",
            truncateDescription: true,
            onSelected: function(data) {
                  displaySelectedData("5: Dropdown with truncated description", data);
            }
      });
      //Demo 8-------------------------
      var ddBasic = [{
            text: "Facebook",
            value: 1,
      }, {
            text: "Twitter",
            value: 2,
      }, {
            text: "LinkedIn",
            value: 3,
      }, {
            text: "Foursquare",
            value: 4,
      }];
      $('#divNoImage').ddslick({
            data: ddBasic,
            selectText: "Select your favorite social network"
      });
      //Callback function:
      function displaySelectedData(demoIndex, ddData) {
            $('#dd-display-data').html("<h3>Data from Demo " + demoIndex + "</h3>");
            $('#dd-display-data').append('<strong>selectedIndex:</strong> ' + ddData.selectedIndex + '<br/><strong>selectedItem:</strong> Check your browser console for selected "li" html element');
            if (ddData.selectedData) {
                  $('#dd-display-data').append(
                        '<br/><br/><strong>selectedData:</strong><br/><strong>Text:</strong> ' + ddData.selectedData.text +
                        '<br/><strong>Value:</strong>  ' + ddData.selectedData.value +
                        '<br/><strong>Description:</strong>  ' + ddData.selectedData.description +
                        '<br/><strong>ImageSrc:</strong>  ' + ddData.selectedData.imageSrc)
            }
            $('#dd-modal').fadeIn();
            console.log(ddData);
      }
      $('#showSampleData').on('click', function() {
            $('#dd-display-data').html('<pre>' + $('#JSONData').html() + '</pre>');
            $('#dd-modal').fadeIn();
      });
      $('#showSampleSelectList').on('click', function() {
            $('#dd-display-data').html('<pre>' + $('#sampleHtmlSelect').html() + '</pre>');
            $('#dd-modal').fadeIn();
      });
});
/**
 * Created with JetBrains WebStorm.
 * User: alistair
 * Date: 14/04/2013
 * Time: 14:26
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function() {

    // The next 3 blocks of code wire up the buttons for the fixed feeds (weather,
    // Rail Info and Football.  The 'any' feed will need to be handled differently
    $("#displayWeatherButton").bind('click', function() {
        var cityCode = document.getElementById("city").options[document.getElementById("city").selectedIndex].value;
        getFeed("http://open.live.bbc.co.uk/weather/feeds/en/"+cityCode+"/3dayforecast.rss",
                showWeatherFeed,cityCode);
    });

});

function getFeed(url, success,cityCode){
    if(navigator.onLine) {
        $.jGFeed(url, function(feeds) {
            // Check for errors
            if(!feeds){
                // there was an error
                return false;
            } else {
                localStorage.setItem(url, JSON.stringify(feeds));
                
                success(feeds.title, feeds.entries, cityCode);
            }
        });
    } else {
        // Get the fall-back...

        var feed = JSON.parse(localStorage.getItem(url));
        
        if(feed != null) {
            alert("No internet connexion");
            
            success(feed.title, feed.entries, cityCode);
        }
    }
}

function showWeatherFeed(title, items, cityCode) {
    $("#weatherTitle").text(title);
    var list = $("#weatherList");
    var footerCity = $("#resultFooter");
    list.empty();
    footerCity.empty();
    var switchImg;
    for(var index = 0; index < items.length; index += 1) {
        switchImg = selectImg(items,index);
        list.append(formatItem(items[index],switchImg));
    }
    footerCity.append(setFooterCity(cityCode)).trigger('create');
    $.mobile.changePage($("#result"), "flip");
    list.listview("refresh");
}

function setFooterCity(cityCode){
    var link = document.createElement("a");
    link.setAttribute("href","http://www.bbc.co.uk/weather/"+cityCode);
    link.setAttribute("id","BBCButton")
    link.setAttribute("data-role","button");
    link.textContent = "BBC Weather Official Website";
    return link;
}

function selectImg(item,index){
    var status = item[index].title.split(",")[0].split(":")[1];
    var image;
    switch(status){
        case " Sunny":
            image = "../src/sunny.png"
            break;
        case " Sunny Intervals":
            image= "../src/sunnyIntervals.png"
            break;
        case " Light Cloud" : 
            image= "../src/lightCloud.png"
            break;
        case " Light Rain Cloud":
            image= "../src/lightRainCloud.png" 
            break;
        case " Light Rain Shower":
            image= "../src/lightRainShower.png"
            break; 
        case " Heavy Rain":
            image= "../src/heavyRain.png"
            break;
        case " Light Rain":
            image= "../src/lightRain.png"
            break;
        case " Heavy Rain Shower":
            image= "../src/heavyRainShower.png"
            break;
        case " Thundery Shower":
            image= "../src/thunderyShower.png"
            break;
        case " Partly Cloudy":
            image= "../src/partlyCloudy.png"
            break;
        case " Sick cloud":
            image= "../src/sickCloud.png"
            break;
        case " Clear Sky":
            image= "../src/clearSky.png"
            break;
        case " Light Snow":
            image= "../src/lightSnow.png"
            break;
        case " Heavy Snow":
            image= "../src/heavySnow.png"
            break;
        case " Sleet":
            image= "../src/sleet.png"
            break;
        case " Light Snow Shower":
            image= "../src/lightSnowShower.png"
            break;   


    }
    
    return image;
}

function showInformationFeed(title, content, link){
    $("#informationTitle").text(title.split(",")[0]);
    var para = $("#morePara");
    var footerDay = $("#moreFooter");
    para.empty();
    footerDay.empty();
    for(var index = 0; index < content.split(",").length; index++){
        var image= chooseImage(content.split(",")[index].split(":")[0])
        para.append(formatInformation(content.split(",")[index],image));
    }
    footerDay.append(setFooterDay(link)).trigger('create');
    $.mobile.changePage($("#more"), "flip");
    para.listview("refresh");
}

function setFooterDay(link){
    var dayLink = document.createElement("a");
    dayLink.setAttribute("href",link);
    dayLink.setAttribute("id","BBCButton")
    dayLink.setAttribute("data-role","button");
    dayLink.textContent = "BBC Weather Official Website";
    return dayLink;
}

function chooseImage(index)
{
    var image;
    switch(index){
        case " Maximum Temperature":
            image= "../src/maxTemp.png"
            break;
        case "Maximum Temperature":
            image= "../src/maxTemp.png"
            break;
                
        case "Minimum Temperature":
            image= "../src/minTemp.png"
            break;
        case " Minimum Temperature":
            image= "../src/minTemp.png"
            break;
                
        case " Wind Direction":
            image= "../src/windDirection.png"
            break;
        case " Wind Speed":
            image= "../src/windSpeed.png"
            break;
        case " Visibility":
            image= "../src/visibility.png"
            break;
        case " Pressure":
            image= "../src/pressure.png"
            break;        
        
        case " Humidity":
            image= "../src/humidity.png"
            break;
        case " UV Risk":
            image= "../src/uvRisk.png"
            break;
        case " Pollution":
            image= "../src/pollution.png"
            break;        
       
        case " Sunrise":
            image= "../src/sunrise.png"
            break;
        case " Sunset":
            image= "../src/sunrise.png"
            break;
        }
        console.log(image);
        console.log(index);
        return image;


}

function formatInformation(para,image){
    var listInfo = document.createElement("li");
        
    var img = document.createElement("img");
    img.setAttribute("src",image);

    listInfo.textContent = para;
    listInfo.appendChild(img)


    return listInfo;
} 


function formatItem(item,switchImg) {
    var listItem = document.createElement("li"),
        anchor = document.createElement("a");

    anchor.setAttribute("href", "#more");
    var img = document.createElement("img");
    img.setAttribute("src",switchImg);

    var showInfo = function() {
        showInformationFeed(item.title, item.content, item.link);
    };

    anchor.addEventListener("click", showInfo);

    anchor.textContent = item.title.split(":")[0];
    anchor.appendChild(img);
    listItem.appendChild(anchor);
    return listItem;
}
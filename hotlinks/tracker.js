var htA=htA||[],hURL=hURL||"";(function(){var a=function(){var b=window.document,c=new Image(),d=hURL+"hotlinks.php";htA.push(["u",b.URL]);htA.push(["r",b.referrer]);c.src=b.location.protocol+d+e();function e(){var f="?",g;for(g=0;g<htA.length;g++){f+=htA[g][0]+"="+escape(htA[g][1])+"&"}return f.replace(/\&$/,"")}};if(window.addEventListener){window.addEventListener("load",a,false)}else{window.attachEvent("onload",a)}})();
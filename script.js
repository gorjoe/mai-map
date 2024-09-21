document.getElementById('ppAsc').addEventListener('click', function() {
    // Handle logic for ordering by amount ascending
    console.log('Ordered by amount ascending');
    loaddata(1, true);
});

document.getElementById('ppDesc').addEventListener('click', function() {
    // Handle logic for ordering by amount descending
    console.log('Ordered by amount descending');
    loaddata(1, false);
});

document.getElementById('timeAsc').addEventListener('click', function() {
    // Handle logic for ordering by people ascending
    console.log('Ordered by time ascending');
    loaddata(2, false);
});

document.getElementById('timeDesc').addEventListener('click', function() {
    // Handle logic for ordering by people ascending
    console.log('Ordered by time ascending');
    loaddata(2, true);
});

// Get the dropdown content
var dropdownContent = document.querySelector('.dropdown-content');

// Show/hide dropdown content on button click
document.querySelector('.dropbtn').addEventListener('click', function() {
   dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
});

const url = "https://maimai-map.joeminecraft1234funs35.workers.dev/";

window.onload = function() {
    loaddata(2, false);
  };

function loaddata(colIndex, asc) {
    dropdownContent.style.display = 'none';
    
    while (document.getElementById('dataContainer').firstChild) {
        document.getElementById('dataContainer').removeChild(document.getElementById('dataContainer').firstChild);
    }

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const values = data.values;

        values.forEach((row, index) => {
            const timestamp = row[2];
            let contime = "";
            
            if (timestamp == "未有回報") {
                values[index][2] = "未有回報";

            } else {
                let ispm = (timestamp.includes("下午")) ? ' PM' : ' AM';
                contime = timestamp.replace("上午", "").replace("下午", "").split(/[年月日]/);
                const retime = contime[0] + "-" + contime[1] + "-" + contime[2] + contime[3] + ispm;
                var datime = new Date(retime);

                values[index][2] = datime.getTime() / 1000;
            }
        });

        values.sort((a, b) => {
            if (asc) {
                const aValue = isNaN(parseInt(a[colIndex])) ? Number.MAX_SAFE_INTEGER : parseInt(a[colIndex]);
                const bValue = isNaN(parseInt(b[colIndex])) ? Number.MAX_SAFE_INTEGER : parseInt(b[colIndex]);

                return aValue - bValue;

            } else {
                const aValue = isNaN(parseInt(a[colIndex])) ? Number.MIN_SAFE_INTEGER : parseInt(a[colIndex]);
                const bValue = isNaN(parseInt(b[colIndex])) ? Number.MIN_SAFE_INTEGER : parseInt(b[colIndex]);

                return bValue - aValue;
            }
        });

        console.log(values);

        values.forEach((row, index) => {
            const place = row[0];
            let status = row[1];
            const timestamp = row[2];
            
            let textTime = "未有回報";
            let timeElapsed = "未有回報";
            
            if (timestamp != "未有回報") {
                var datime = new Date(timestamp*1000);
                let endTime = new Date();
                textTime = datime.toLocaleString('zh-tw')
                let diff = endTime - datime;
                let mm = Math.floor(diff / 1000 / 60) % 60;
                let hh = Math.floor(diff / 1000 / 60 / 60) % 24;
                let dd = Math.floor(diff / 1000 / 60 / 60 / 24) % 7;
                timeElapsed = `${hh}h ${mm}m`;
                if(dd >= 1) {
                    status = "未有回報";
                    textTime = "未有回報";
                    timeElapsed = "未有回報";
                }
            }

            const cardHTML = `
                <div class="card">
                    <h3>${place}</h3>
                    <p><strong>即時人數:</strong> ${status}</p>
                    <p><strong>最新回報時間:</strong> ${textTime}</p>
                    <p><strong>距離時間:</strong> ${timeElapsed}</p>
                </div>
            `;
            
            document.getElementById('dataContainer').innerHTML += cardHTML;
        });
    })
    .catch(error => console.error('Error fetching data:', error));
}
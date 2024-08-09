var time_new_log = formatDateTime(new Date().toISOString());
var time_old_log = formatDateTime(new Date().toISOString());

$(document).ready(function() {
    getOldLogs();

    setInterval(getNewLogs, 5000);

    $(document).on('click', '.log-items ul li', function() {
        var subRequest = $(this).find('.sub-row');
        
        if (subRequest.is(':visible')) {
            subRequest.slideUp();
        } else {
            subRequest.slideDown();
        }
    });
});

function getOldLogs() {
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');

    fetch(`/api/${language}/old-logs?time=${encodeURIComponent(time_new_log)}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application",
            'authentication': access_token
        }
    })
    .then(response => response.json().then(data => {
        if (!response.ok) {
            showNotification(data.message);
            throw new Error('Network response was not ok');
        }
        return data;
    }))
    .then(result => {
        logs = result.data;
        if (logs.length > 0) {
            time_old_log = formatDateTime(logs[logs.length - 1].create_at);
            appendLogs(logs, false);
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function getNewLogs() {
    const language = $('header').data('language');
    const access_token = localStorage.getItem('access_token');

    fetch(`/api/${language}/new-logs?time=${encodeURIComponent(time_new_log)}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application",
            'authentication': access_token
        }
    })
    .then(response => response.json().then(data => {
        if (!response.ok) {
            showNotification(data.message);
            throw new Error('Network response was not ok');
        }
        return data;
    }))
    .then(result => {
        logs = result.data;
        if (logs.length > 0) {
            time_new_log = formatDateTime(logs[0].create_at);
            appendLogs(logs, true);
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function appendLogs(logs, prepend) {
    const logItems = $('.log-items ul');
    logs.forEach(log => {
        const logRow = $(`
            <li class="col" style="display: none;">
                <div class="row">
                    <div class="admin row">
                        <div class="image center"><i class="fa-solid fa-user-tie"></i></div>
                        <div class="admin-container col">
                            <span class="admin-name">${ log.admin_name }</span>
                            <span class="admin-account">${ log.admin_account }</span>
                        </div>
                    </div>
                    <div class="action center">
                        <span>${ log.action }</span>
                    </div>
                    <div class="status center ${log.status ? 'success' : 'unsuccess'}">
                        <span>${log.status ? 'Success' : 'Unsuccess'}</span>
                    </div>
                    <div class="date center">
                        <span>${formatDateTime(log.create_at)}</span>
                    </div>
                </div>
                <div class="sub-row">
                    <div class="detail">
                        <span>${log.detail}</span>
                    </div>
                </div>
            </li>
        `);
        if (prepend) {
            logItems.prepend(logRow);
        } else {
            logItems.append(logRow);
        }
        logRow.slideDown();
    });
}

export function fetchSortSettings(tBodyEl, select, sort, order){
    const data = {
        select: select.value,
        sort: sort,
        order: order
    };

    console.log(data);

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Server responded with status ${res.status}`);
        }
        return res.json();
    })
    .then(response => {
        console.log(response.message);
        showNewTable(tBodyEl, response.data);       
    })
    .catch(error => {
        console.error('Submission failed:', error);
    });
}

function showNewTable(tbody, data = []){
    let tBody = ``;

    data.forEach(element => {
        tBody += `
            <tr>
                <td class="fw-semibold">${element.scramble_type}</td>
                <td class="text-start text-break">${element.scramble}</td>
                <td class="text-nowrap">${element.time}</td>
                <td class="text-nowrap">${element.timestamp}</td>
            </tr>
        `;
    });
    tbody.innerHTML = tBody;
};
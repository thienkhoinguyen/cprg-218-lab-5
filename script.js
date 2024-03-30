/** Link to digimon api
 * https://digi-api.com/
 */

/*Create Card */

async function createCardElement(item) {
    return `
    <li class="card">
        <img src="${item.image}" alt="">
        <div class="card-content">
            <p class="subheader">${item.subtitle}</p>
            <h3 class="header">${item.title}</h3>
            <p class="attribute">Attribute: ${item.attribute}</p>
         </div>
    </li>`;
}

async function fetchDigimonDetails(url) {
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
    }
}


async function fetchDigimonList() {
    try {
        const response = await fetch("https://digi-api.com/api/v1/digimon");
        const data = await response.json();
        nextPageUrl = data.pageable.nextPage;
        return data.content;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function renderOption1Dropdown() {
    const select = document.getElementById("dropdown");
    let list = await fetchDigimonList();
    console.log(list);
    while (list) {
        list.forEach((item) => {
            const option = document.createElement("option");
            option.textContent = item.name;
            option.value = item.href;
            select.appendChild(option);
        });
        list = await fetchMoreDigimon();
    }
}

renderOption1Dropdown();

const option1SubmitButton = document.getElementById("submit-button");
option1SubmitButton.addEventListener("click", option1DropdownClickHandler);
/** Link to digimon api
 * https://digi-api.com/
 */

/*Create Card */

async function createCardElement(item) {
    return `
    <div class="card">
        <img src="${item.image}" alt="">
        <div class="card-content">
            <p class="subheader">${item.subtitle}</p>
            <h3 class="header">${item.title}</h3>
            <p class="attribute">Attribute: ${item.attribute}</p>
            <p class="field">Field: ${item.field}</p>
            <p class="digimon-id">Digimon ID: ${item.id}</p>
         </div>
    </div>`;
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

async function renderOption1Results(data) {
    console.log("Digimon Data:", data);

    const imageUrl = data.images[0]?.href || "";
    console.log("Image URL:", imageUrl);

    const attributeId = data.attributes[0]?.id || ""; 
    const attributeData = await fetchAttributeDetailsById(attributeId);
    const attribute = attributeData.name || "Unknown Attribute";

    const fieldId = data.fields[0]?.id || ""; 
    const fieldData = await fetchFieldDetailsById(fieldId);
    const field = fieldData.name || "Unknown Field";

    const card = await createCardElement({
        id: data.id,
        title: data.name,
        subtitle: `${data.types.map((type) => type.type).join(", ")}`,
        image: imageUrl,
        attribute: attribute,
        field: field 
    });
    document.getElementById("option-1-results").innerHTML = card;
}

async function fetchAttributeDetailsById(id) {
    try {
        const response = await fetch(`https://digi-api.com/api/v1/attribute/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return {};
    }
}

async function fetchFieldDetailsById(id) {
    try {
        const response = await fetch(`https://digi-api.com/api/v1/field/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return {};
    }
}

async function option1DropdownClickHandler(event) {
    const select = document.getElementById("dropdown");
    const url = select.options[select.selectedIndex].value;
    const data = await fetchDigimonDetails(url);
    console.log(data);
    if (data) {
        renderOption1Results(data);
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

let nextPageUrl;

async function fetchMoreDigimon() {
    try {
        if (nextPageUrl) {
            const response = await fetch(nextPageUrl);
            const data = await response.json();
            nextPageUrl = data.pageable.nextPage;
            return data.content;
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}

renderOption1Dropdown();

const option1SubmitButton = document.getElementById("submit-button");
option1SubmitButton.addEventListener("click", option1DropdownClickHandler);


/**digimon list Option 2 */

async function renderOption2() {
    const myFavouriteDigimon = ["Beelzebumon", "Dukemon", "war greymon", "dianamon", "angemon", "leomon"];

    const fetchDigimonData = async (digimon) => {
        try {
            const url = `https://digi-api.com/api/v1/digimon/${digimon}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch data for ${digimon}: ${response.status} - ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    try {
        const digimonData = await Promise.all(
            myFavouriteDigimon.map(fetchDigimonData)
        );

        const cardData = digimonData.map(async (data) => {
            if (!data) return null;
            const imageUrl = data.images[0]?.href || "";
            // Fetch attribute and field details
            const attributeData = await fetchAttributeDetailsById(data.attributes[0]?.id);
            const attribute = attributeData.name || "Unknown Attribute";
            const fieldData = await fetchFieldDetailsById(data.fields[0]?.id);
            const field = fieldData.name || "Unknown Field";
            return {
                id: data.id,
                title: data.name,
                subtitle: `${data.types.map((type) => type.type).join(", ")}`,
                image: imageUrl,
                attribute: attribute,
                field: field
            };
        });

        let cardsHtml = '';
        for await (const digimon of cardData) {
            if (digimon) {
                const card = await createCardElement(digimon);
                cardsHtml += card;
            }
        }

        document.getElementById("digimon-results").innerHTML = cardsHtml;
    } catch (error) {
        console.error("Error digimon cards:", error);
    }
}

renderOption2(); 

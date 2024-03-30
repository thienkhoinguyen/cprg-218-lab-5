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

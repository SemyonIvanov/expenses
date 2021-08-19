const whereSpentInput = document.getElementById('where-spent');
const howMuchSpentInput = document.getElementById('how-much-spent');
const buttonAddEl = document.getElementById('button-add-el');
const mainList = document.getElementById('main-list');
const total = document.getElementById('total');
let items;

window.onload = async function () {
  const resp = await fetch('http://localhost:8000/',
      {
        method: 'GET'
      });
  items = await resp.json();
  render(items);
}

function render(collection) {
  mainList.innerHTML = '';
  collection.forEach((item, index) => {
    console.log(item)
    const li = document.createElement('li');
    const whereSpentSpan = document.createElement('span');
    const howMuchSpentSpan = document.createElement('span');
    const buttonEdit = document.createElement('button');
    const buttonDelete = document.createElement('button');

    buttonEdit.className = 'edit';
    buttonDelete.className = 'delete';

    whereSpentSpan.innerHTML = item.whereSpent;
    howMuchSpentSpan.innerHTML = item.howMuchSpent;

    mainList.appendChild(li);
    li.appendChild(whereSpentSpan);
    li.appendChild(howMuchSpentSpan);
    li.appendChild(buttonEdit);
    li.appendChild(buttonDelete);

    buttonEdit.addEventListener('click', () => onBtnEditClick(index));
    buttonDelete.addEventListener('click', () => onBtnDeleteClick(index));
  });
}

buttonAddEl.addEventListener('click', onBtnAddClick);

async function onBtnAddClick() {
  if (whereSpentInput.value && howMuchSpentInput.value) {
    const resp = await fetch('http://localhost:8000/createNewItem',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            whereSpent: whereSpentInput.value,
            howMuchSpent: howMuchSpentInput.value
          })
        });
    items = await resp.json();
    render(items);
    whereSpentInput.value = '';
    howMuchSpentInput.value = '';
  }
}

async function onBtnEditClick(index) {
  whereSpentInput.value = items.whereSpent;
  howMuchSpentInput.value = items.howMuchSpent;
  const itemId = items[index]._id;
  const resp = await fetch('http://localhost:8000/updateItem',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({

        })
      });
  items = await resp.json();
  render(items);
}

async function onBtnDeleteClick(index) {
  const itemId = items[index]._id;
  console.log(itemId)
  const resp = await fetch(`http://localhost:8000/deleteItem?id=${itemId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        },
      });
  items = await resp.json();
  render(items);
}


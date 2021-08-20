const HEADERS = {
  'Content-Type': 'application/json;charset=utf-8',
  'Access-Control-Allow-Origin': '*'
};
const whereSpentInput = document.getElementById('where-spent');
const howMuchSpentInput = document.getElementById('how-much-spent');
const buttonAddEl = document.getElementById('button-add-el');
const mainList = document.getElementById('main-list');
const total = document.getElementById('total');
let items;

const render = collection => {
  mainList.innerHTML = '';
  collection.forEach(item => {
    const li = document.createElement('li');
    let whereSpentSpan;
    if (item.isWhereEdit) {
      whereSpentSpan = document.createElement('input');
      whereSpentSpan.value = item.whereSpent;
      whereSpentSpan.addEventListener("keyup", (e) => onChangeTarget(e, item));
      whereSpentSpan.addEventListener("blur", (e) => editTarget(e, item));
      window.setTimeout(() => whereSpentSpan.focus(), 0);
    } else {
      whereSpentSpan = document.createElement('span');
      whereSpentSpan.setAttribute('title', item.whereSpent)
      whereSpentSpan.innerHTML = item.whereSpent;
      whereSpentSpan.addEventListener('dblclick', () => onDblClickWhere(item))
    }
    let howMuchSpentSpan;
    if (item.isHowMuchEdit) {
      howMuchSpentSpan = document.createElement('input');
      howMuchSpentSpan.setAttribute('type', 'number');
      howMuchSpentSpan.value = item.howMuchSpent;
      howMuchSpentSpan.addEventListener("keyup", (e) => onChangeTarget(e, item));
      howMuchSpentSpan.addEventListener("blur", (e) => editTarget(e, item));
      window.setTimeout(() => howMuchSpentSpan.focus(), 0);
    } else {
      howMuchSpentSpan = document.createElement('span');
      howMuchSpentSpan.setAttribute('title', item.howMuchSpent)
      howMuchSpentSpan.innerHTML = `${item.howMuchSpent} p.`;
      howMuchSpentSpan.addEventListener('dblclick', () => onDblClickHowMuch(item))
    }
    const buttonEdit = document.createElement('button');
    const buttonDelete = document.createElement('button');

    buttonEdit.className = 'edit';
    buttonDelete.className = 'delete';

    mainList.appendChild(li);
    li.appendChild(whereSpentSpan);
    li.appendChild(howMuchSpentSpan);
    li.appendChild(buttonEdit);
    li.appendChild(buttonDelete);

    buttonEdit.addEventListener('click', () => onBtnEditClick(item));
    buttonDelete.addEventListener('click', () => onBtnDeleteClick(item));
  });
}

const request = async (url, method, headers, body) => {
  const resp = await fetch(url,
      {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
      });
  items = await resp.json();
  total.innerHTML = `Итого: ${items.total} p.`;
  render(items.body);
}

window.onload = async () => {
  await request('http://localhost:8000/', 'GET');
}

const onBtnAddClick = async () => {
  if (whereSpentInput.value && howMuchSpentInput.value && typeof +howMuchSpentInput.value === 'number') {
    await request(
        'http://localhost:8000/createNewItem',
        'POST',
        HEADERS,
        {
          whereSpent: whereSpentInput.value,
          howMuchSpent: howMuchSpentInput.value
        })
    whereSpentInput.value = '';
    howMuchSpentInput.value = '';
  }
}

let btnAddOrSave = onBtnAddClick;

const onClickAddOrSave = async () => {
  await btnAddOrSave();
}

buttonAddEl.addEventListener('click', () => onClickAddOrSave());

const onBtnEditClick = item => {
  whereSpentInput.value = item.whereSpent;
  howMuchSpentInput.value = item.howMuchSpent;
  buttonAddEl.innerHTML = 'Сохранить';
  btnAddOrSave = () => editItem(item);
}

const editItem = async item => {
  if (whereSpentInput.value && howMuchSpentInput.value && typeof +howMuchSpentInput.value === 'number') {
    const itemId = item._id;
    await request(
        'http://localhost:8000/updateItem',
        'PATCH',
        HEADERS,
        {
          _id: itemId,
          whereSpent: whereSpentInput.value,
          howMuchSpent: howMuchSpentInput.value
        }
    )
    buttonAddEl.innerHTML = 'Добавить';
    btnAddOrSave = onBtnAddClick;
    whereSpentInput.value = '';
    howMuchSpentInput.value = '';
  }
}

const onBtnDeleteClick = async item => {
  const itemId = item._id;
  await request(
      `http://localhost:8000/deleteItem?id=${itemId}`,
      'DELETE',
      HEADERS,
  )
}

function onDblClickWhere(item) {
  item.isWhereEdit = true;
  render(items.body)
}

function onDblClickHowMuch(item) {
  item.isHowMuchEdit = true;
  render(items.body)
}

async function onChangeTarget(e, item) {
  e.preventDefault();
  if (e.keyCode === 13) {
    await editTarget(e, item);
  }
}

async function editTarget(e, item) {
  if (item.isWhereEdit) {
    item.isWhereEdit = false;
    const itemId = item._id;
    await request(
        'http://localhost:8000/updateItem',
        'PATCH',
        HEADERS,
        {
          _id: itemId,
          whereSpent: e.target.value
        }
    )
  } else {
    if (e.target.value && typeof +e.target.value === 'number') {
      item.isHowMuchEdit = false;
      const itemId = item._id;
      await request(
          'http://localhost:8000/updateItem',
          'PATCH',
          HEADERS,
          {
            _id: itemId,
            howMuchSpent: e.target.value
          }
      )
    }
  }
}
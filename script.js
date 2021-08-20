const whereSpentInput = document.getElementById('where-spent');
const howMuchSpentInput = document.getElementById('how-much-spent');
const buttonAddEl = document.getElementById('button-add-el');
const mainList = document.getElementById('main-list');
const total = document.getElementById('total');
let items;

const render = collection => {
  mainList.innerHTML = '';
  collection.forEach((item, index) => {
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
      whereSpentSpan.innerHTML = item.whereSpent;
      whereSpentSpan.addEventListener('dblclick', () => onDblClickWhere(item))
    }
    let howMuchSpentSpan;
    if (item.isHowMuchEdit) {
      howMuchSpentSpan = document.createElement('input');
      howMuchSpentSpan.value = item.howMuchSpent;
      howMuchSpentSpan.addEventListener("keyup", (e) => onChangeTarget(e, item));
      howMuchSpentSpan.addEventListener("blur", (e) => editTarget(e, item));
      window.setTimeout(() => howMuchSpentSpan.focus(), 0);
    } else {
      howMuchSpentSpan = document.createElement('span');
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
  if (whereSpentInput.value && typeof +howMuchSpentInput.value === 'number') {
    await request(
        'http://localhost:8000/createNewItem',
        'POST',
        {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        },
        {
          whereSpent: whereSpentInput.value,
          howMuchSpent: howMuchSpentInput.value
        })
    whereSpentInput.value = '';
    howMuchSpentInput.value = '';
  }
}

let functionName = onBtnAddClick;

const test = () => {
  functionName();
}

buttonAddEl.addEventListener('click', () => test());

const onBtnEditClick = item => {
  whereSpentInput.value = item.whereSpent;
  howMuchSpentInput.value = item.howMuchSpent;
  buttonAddEl.innerHTML = 'Сохранить';
  functionName = () => editItem(item);
}

const editItem = async item => {
  const itemId = item._id;
  await request(
      'http://localhost:8000/updateItem',
      'PATCH',
      {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      {
        _id: itemId,
        whereSpent: whereSpentInput.value,
        howMuchSpent: howMuchSpentInput.value
      }
  )
  buttonAddEl.innerHTML = 'Добавить';
  functionName = onBtnAddClick;
  whereSpentInput.value = '';
  howMuchSpentInput.value = '';
}

const onBtnDeleteClick = async item => {
  const itemId = item._id;
  await request(
      `http://localhost:8000/deleteItem?id=${itemId}`,
      'DELETE',
      {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
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
        {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        },
        {
          _id: itemId,
          whereSpent: e.target.value
        }
    )
  } else {
    item.isHowMuchEdit = false;
    const itemId = item._id;
    await request(
        'http://localhost:8000/updateItem',
        'PATCH',
        {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        },
        {
          _id: itemId,
          howMuchSpent: e.target.value
        }
    )
  }
}
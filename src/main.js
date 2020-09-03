// variable declaration

let extensionField;
let loader;
let assetList;
let messageContainer;
let stack;
let hideButton;
let chooseButton;
let assetListSection;
let initialResponse;
let currentAssetList = [];
let storedData = [];

class stackData {

  // fetch assets from another stack

  getAsset() {
    const setting = this;
    let statusCode;
    return new Promise((resolve, reject) => {
      fetch(`${extensionField.config.baseUrlRegion}v3/assets`, {
          method: 'GET',
          headers: {
            api_key: extensionField.config.apiKey,
            authorization: extensionField.config.managementToken,
          },
        })
        .then((response) => {
          statusCode = response.status;
          return response.json();
        })
        .then((response) => {
          if (statusCode === 200) {
            return resolve(response);
          }
          throw Error('Failed to fetch');
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

const close = () => {
  hideButton.hide();
  chooseButton.show();
  assetListSection.hide();
}

// selected asset removal handler

$('body').on('click', '.mainDiv', (e) => {
  let deleteAsset;
  storedData.map((obj) => {
    if (obj.uid === e.currentTarget.id) {
      deleteAsset = storedData.indexOf(obj);
    }
  });
  storedData.splice(deleteAsset, 1);
  $(`#${e.currentTarget.id}`).empty();
  extensionField.field.setData(storedData);
});

// asset selection event handler

const selectAsset = (asset) => {
  const selectedContainer = asset.map((obj) => {

    if (obj.filename.includes('.pdf')) {

      return `<div  id='${obj.uid}' class="col-xs-6 col-sm-4 col-md-3 mainDiv"  title="${obj.title}"><li>
    <div class="img-wrapper">
      <img class="thumbnail" src="data:image/png;base64,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">
    </div>
    <span class="title truncate">${obj.title}</span>
    <span title="Remove asset" id="close-button">×</span>

</li></div>`
    }
    if (obj.filename.includes('.docx')) {

      return `<div  id='${obj.uid}' class="col-xs-6 col-sm-4 col-md-3 mainDiv"  title="${obj.title}"><li>
  <div class="img-wrapper">
    <img class="thumbnail" src='data:image/png;base64,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'>
  </div>
  <span class="title truncate">${obj.title}</span>
  <span title="Remove asset" id="close-button">×</span>

</li></div>`
    }
    if (obj.filename.includes('.mp4')) {

      return `<div  id='${obj.uid}' class="col-xs-6 col-sm-4 col-md-3 mainDiv"  title="${obj.title}"><li>
  <div class="img-wrapper">
    <img class="thumbnail" src='data:image/png;base64,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'>
  </div>
  <span class="title truncate">${obj.title}</span>
  <span title="Remove asset" id="close-button">×</span>

</li></div>`
    }
    if (obj.filename.includes('.xlsx')) {

      return `<div  id='${obj.uid}' class="col-xs-6 col-sm-4 col-md-3 mainDiv"  title="${obj.title}"><li>
  <div class="img-wrapper">
    <img class="thumbnail" src="data:image/png;base64,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">
  </div>
  <span class="title truncate">${obj.title}</span>
  <span title="Remove asset" id="close-button">×</span>

</li></div>`
    }
    return `<div  id='${obj.uid}' class="col-xs-6 col-sm-4 col-md-3 mainDiv"  title="${obj.title}"><li>
  <div class="img-wrapper">
    <img class="thumbnail" src=${obj.url}>
  </div>
  <span class="title truncate">${obj.title}</span>
  <span title="Remove asset" id="close-button">×</span>

</li></div>`
  })

  $('#selected-asset').html(selectedContainer);
}


// eventListener function

const domChangeListener = () => {
  const listElement = $('#asset-list li');
  listElement.click((event) => {
    const selectedAsset = currentAssetList.find(
      (index) => index.uid === event.currentTarget.id,
    );
    const stringifyData = selectedAsset;
    storedData.push(stringifyData);
    extensionField.field.setData(storedData).then(() => {
      selectAsset(storedData);
      close();
    });
  });
}

// No asset available event handler

const displayMessage = (message = "No assets found") => {
  messageContainer.text(message);
  messageContainer.show();
  loader.hide();
}

// asset list render method

const render = (data) => {
  if (data.assets.length === 0) {
    loader.hide();
    assetList.empty();
    displayMessage();
  }
  currentAssetList.push(...data.assets);
  loader.hide();
  if (currentAssetList.length != 0) {
    messageContainer.hide();
  }
  data.assets.map((index, obj) => {
    if (index.filename.includes('.pdf')) {
      return assetList.append(`<li class="col-xs-6 col-sm-4 col-md-3" title="${index.title}"  id="${index.uid}">
      <div class="box">
      <div class="img-wrapper">
         <img class="thumbnail" src="data:image/png;base64,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">
      </div>
      <span class="title truncate">${index.title}</span>
      </div>
      
    </li>`);

    }
    if (index.filename.includes('.docx')) {
      return assetList.append(`<li class="col-xs-6 col-sm-4 col-md-3" title="${index.title}"  id="${index.uid}">
                              <div class="box">
                              <div class="img-wrapper">
                                <img class="thumbnail" src='data:image/png;base64,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'>
                              </div>
                              <span class="title truncate">${index.title}</span>
                              </div>
                          </li>`);
    }
    if (index.filename.includes('.mp4')) {
      return assetList.append(`<li class="col-xs-6 col-sm-4 col-md-3" title="${index.title}"  id="${index.uid}">
      <div class="box">
      <div class="img-wrapper">
        <img class="thumbnail" src='data:image/png;base64,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'>
      </div>
      <span class="title truncate">${index.title}</span>
      </div>
  </li>`);
    }
    if (index.filename.includes('.xlsx')) {
      return assetList.append(`<li class="col-xs-6 col-sm-4 col-md-3" title="${index.title}"  id="${index.uid}">
      <div class="box">
      <div class="img-wrapper">
        <img class="thumbnail" src="data:image/png;base64,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">
      </div>
      <span class="title truncate">${index.title}</span>
      </div>
  </li>`);
    }
    assetList.append(`<li class="col-xs-6 col-sm-4 col-md-3" title="${index.title}"  id="${index.uid}">
    <div class="box">
    <div class="img-wrapper">
      <img class="thumbnail" src="${index.url}" alt="image-6"> 
    </div>
    <span class="title truncate">${index.title}</span>
    </div>
</li>`);

  });
  domChangeListener();
}

const initializeAssetList = () => {
  messageContainer = $('#message-container');
  loader = $('.reference-loading');
  assetList = $('#asset-list');
  assetListSection = $('#choose-asset-section');
  stack = new stackData(extensionField.config);

  stack
    .getAsset()
    .then((response) => {
      initialResponse = response;
      render(response);
      chooseButton.show();
    })
    .catch((err) => {
      console.log(err);
    });
}

const initializeButtons = () => {
  hideButton = $('#hide-button');
  chooseButton = $('#choose-button');

  chooseButton.click(() => {
    hideButton.show();
    chooseButton.hide();
    assetListSection.show();
  });

  hideButton.click(close);
}

// Contentstack UI extension initialization

$(document).ready(() => {
  ContentstackUIExtension.init().then((extension) => {
    extensionField = extension;
    extensionField.window.enableAutoResizing();
    const previouslySelectedAsset = extensionField.field.getData();
    storedData = extensionField.field.getData();
    if (previouslySelectedAsset && !$.isEmptyObject(previouslySelectedAsset)) {
      selectAsset(previouslySelectedAsset);
    }

    initializeAssetList();
    initializeButtons();
  });
});
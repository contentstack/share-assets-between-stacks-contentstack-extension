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

    if (obj.filename.includes('.html')) {
      return `<div  id='${obj.uid}' class="col-xs-6 col-sm-4 col-md-3 mainDiv"  title="${obj.title}"><li>
      <div class="img-wrapper">
          <img class="thumbnail"   src="https://images.contentstack.io/v3/assets/bltff856f3f034d89c7/blt85fed3b54d2ee3e3/5f4f41d1b553152466d1b83b/html.png">
      </div>
      <span class="title truncate">${obj.title}</span>
      <span title="Remove asset" id="close-button">×</span>
  
  </li></div>`
    }
    if (obj.filename.includes('.pdf')) {

      return `<div  id='${obj.uid}' class="col-xs-6 col-sm-4 col-md-3 mainDiv"  title="${obj.title}"><li>
    <div class="img-wrapper">
        <img class="thumbnail" src="https://images.contentstack.io/v3/assets/bltff856f3f034d89c7/blt10bf01343d651a66/5f4f41d1ee702027c4ce7b4a/pdf.png">
    </div>
    <span class="title truncate">${obj.title}</span>
    <span title="Remove asset" id="close-button">×</span>

</li></div>`
    }
    if (obj.filename.includes('.docx')) {

      return `<div  id='${obj.uid}' class="col-xs-6 col-sm-4 col-md-3 mainDiv"  title="${obj.title}"><li>
  <div class="img-wrapper">
      <img class="thumbnail" src="https://images.contentstack.io/v3/assets/bltff856f3f034d89c7/blt389bb693f7467f73/5f4f41d1c0ed4228f9e58231/docx.png">
  </div>
  <span class="title truncate">${obj.title}</span>
  <span title="Remove asset" id="close-button">×</span>

</li></div>`
    }
    if (obj.filename.includes('.mp4')) {

      return `<div  id='${obj.uid}' class="col-xs-6 col-sm-4 col-md-3 mainDiv"  title="${obj.title}"><li>
  <div class="img-wrapper">
      <img class="thumbnail" src="https://images.contentstack.io/v3/assets/bltff856f3f034d89c7/blt9bb66c06ff805cf8/5f4f41d127123625cbaecb4e/mp4.png">
  </div>
  <span class="title truncate">${obj.title}</span>
  <span title="Remove asset" id="close-button">×</span>

</li></div>`
    }
    if (obj.filename.includes('.xlsx')) {

      return `<div  id='${obj.uid}' class="col-xs-6 col-sm-4 col-md-3 mainDiv"  title="${obj.title}"><li>
  <div class="img-wrapper">
      <img class="thumbnail" src="https://images.contentstack.io/v3/assets/bltff856f3f034d89c7/blt21a5746ff4152b7a/5f4f41d2b5badb2465bb935e/xlsx-file-format-extension.png">
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
      <img class="thumbnail" src="https://images.contentstack.io/v3/assets/bltff856f3f034d89c7/blt10bf01343d651a66/5f4f41d1ee702027c4ce7b4a/pdf.png">
      </div>
      <span class="title truncate">${index.title}</span>
      </div>
      
    </li>`);

    }
    if (index.filename.includes('.docx')) {
      return assetList.append(`<li class="col-xs-6 col-sm-4 col-md-3" title="${index.title}"  id="${index.uid}">
                              <div class="box">
                              <div class="img-wrapper">
                              <img class="thumbnail" src="https://images.contentstack.io/v3/assets/bltff856f3f034d89c7/blt389bb693f7467f73/5f4f41d1c0ed4228f9e58231/docx.png">
                              </div>
                              <span class="title truncate">${index.title}</span>
                              </div>
                          </li>`);
    }
    if (index.filename.includes('.mp4')) {
      return assetList.append(`<li class="col-xs-6 col-sm-4 col-md-3" title="${index.title}"  id="${index.uid}">
      <div class="box">
      <div class="img-wrapper">
      <img class="thumbnail" src="https://images.contentstack.io/v3/assets/bltff856f3f034d89c7/blt9bb66c06ff805cf8/5f4f41d127123625cbaecb4e/mp4.png">
      </div>
      <span class="title truncate">${index.title}</span>
      </div>
  </li>`);
    }
    if (index.filename.includes('.html')) {

      return assetList.append(`<li class="col-xs-6 col-sm-4 col-md-3" title="${index.title}"  id="${index.uid}">
    <div class="box">
    <div class="img-wrapper">
    <img class="thumbnail"   src="https://images.contentstack.io/v3/assets/bltff856f3f034d89c7/blt85fed3b54d2ee3e3/5f4f41d1b553152466d1b83b/html.png">
    </div>
    <span class="title truncate">${index.title}</span>
    </div>
</li>`);
    }
    if (index.filename.includes('.xlsx')) {
      return assetList.append(`<li class="col-xs-6 col-sm-4 col-md-3" title="${index.title}"  id="${index.uid}">
      <div class="box">
      <div class="img-wrapper">
      <img class="thumbnail" src="https://images.contentstack.io/v3/assets/bltff856f3f034d89c7/blt21a5746ff4152b7a/5f4f41d2b5badb2465bb935e/xlsx-file-format-extension.png">
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
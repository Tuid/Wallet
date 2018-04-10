module.exports = {
    elements: {
        sendTab: by.xpath('//li[.="Send"]'),
        select: by.className('sonm-account-big-select'),
        selectedAccount: by.className('sonm-account-item__name-text'),
        successNotification: by.xpath(
            '//div[@class="sonm-alert-list__item sonm-alert sonm-alert--success"]/span[@class="sonm-alert__message"]',
        ),
        successNotificationCross: by.xpath(
            '//div[@class="sonm-alert-list__item sonm-alert sonm-alert--success"]/div[@type="button"]',
        ),
    },

    //navigate to send tab

    navigateToSendTab: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.sendTab,
        )).click();
    },

    // verify part of notification

    verifyNotificationText: async function(text) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.successNotification,
        ))
            .getText()
            .then(validMessageText => {
                expect(validMessageText).to.contain(
                    shared.messages.tx.successtx,
                );
                expect(validMessageText).to.contain(text);
            });
    },

    // close notification

    closeNotification: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.successNotificationCross,
        )).click();
    },

    //verify that element is displayed on page

    checkElementIsDisabled: async function(el, cssValue, expectedCssValue) {
        const webElement = await driver.wait(until.elementLocated(el));
        // console.log(el);
        // console.log(webElement);
        const actualCssValue = await webElement.getCssValue(cssValue);
        //console.log(actualCssValue);
        return expect(actualCssValue).to.equal(expectedCssValue);
    },

    //select value from dropdown

    selectFromStandardDropdown: async function(
        element,
        dropdownItem,
        selectedItem,
        name,
    ) {
        (await shared.wdHelper.findVisibleElement(element)).click();
        (await shared.wdHelper.findVisibleElement(dropdownItem)).click();
        return (await shared.wdHelper.findVisibleElement(selectedItem))
            .getText()
            .then(text => expect(text).to.equal(name));
    },

    //get all values from dropdown

    getValuesFromDropdown: async function(dropdown, dropdownValue) {
        (await shared.wdHelper.findVisibleElement(dropdown)).click();
        let values = await shared.wdHelper.findVisibleElements(dropdownValue);
        let valuesText = [];
        for (let i = 0; i < values.length; i++) {
            valuesText.push(await values[i].getText());
        }
        return await valuesText;
    },

    //click on dropdown

    clickDropdown: async function(element) {
        return (await shared.wdHelper.findVisibleElement(element)).click();
    },

    //assert array to string

    assertDropdownValues: async function(arrayOne, searchValue) {
        return await expect(JSON.stringify(arrayOne)).to.equal(searchValue);
    },

    //enter value into dropdown for search

    enterValueForSearch: async function(dropdownSearchField, searchValue) {
        return (await shared.wdHelper.findVisibleElement(
            dropdownSearchField,
        )).sendKeys(searchValue);
    },

    //verify that validation error message is displayed

    verifyValidationErrorMessage: async function(element, messageText) {
        // return (await shared.wdHelper.findVisibleElement(element))
        //     .getText()
        //     .then(validMessageText =>
        //         expect(validMessageText).to.equal(messageText),
        //     );
        let messageElement = await shared.wdHelper.findVisibleElement(element);
        return await driver.wait(
            until.elementTextIs(messageElement, messageText),
        );
    },

    //clear input field

    clearInputField: async function(field) {
        return (await shared.wdHelper.findVisibleElement(field)).clear();
    },

    //verify that field is empty or not

    verifyFieldLength: async function(field) {
        return (await driver.findElement(field)).getAttribute('value');
    },
};
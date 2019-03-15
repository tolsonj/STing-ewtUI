// spec.js
describe('Protractor Demo App', function() {
	beforeAll(function() {
		var login = element(by.model('account.username'));
		var password = element(by.model('account.password'));

		var goButton = element(by.partialButtonText('Login'));

		var radioButtonMed = element(by.model('Login'));


		browser.get('http://127.0.0.1:8081/#/page/login');
		login.sendKeys('TOLSON');
		password.sendKeys('TOLSON');
		goButton.click();

	});

	describe('dashboard', function() {
		function selectDropdownbyNum(element, optionNum) {
			if (optionNum) {
				var options = element.all(by.tagName('option'))
					.then(function(options) {
						options[optionNum].click();
					});
			}
		};



		it('Should login into CAPTN', function() {

			//console.log('dashboard in');
			//browser.getTitle().then(function(t) {
			//	console.log(t);
			//});
			//console.log('dashboard 1');
			//expect(element(by.id('r1')).isPresent()).toEqual(true);
			browser.sleep(3500);
			element(by.id('r1')).click();
			//console.log('dashboard 2');
			var medical = element(by.model('BolDet.customerNumber'));
			var selectMedical = medical.element(by.css('.ui-select-search'));
			medical.click()
				//console.log('dashboard 3');
			selectMedical.sendKeys('450');
			//console.log('dashboard 4');
			// browser.sleep(36000);
			browser.actions().sendKeys(protractor.Key.ENTER).perform();


			//element.all(by.css('ui-select-choices-row-inner')).count().then(function(count) {
			//	console.log(count);
			//});
			//v.click();

			element(by.id('buttonConfirm')).click();
			//expect(buttonSubmit.isPresent()).toEqual(true);
			// browser.sleep(3000);
			//element(by.partialButtonText('Submit')).click();
			//console.log('dashboard 5');
			// element(by.partialButtonText('Next')).click();
			//console.log('dashboard 6');
			//element(by.css('a.btn.btn-primary.pull-right.ng-binding')).click(); // Next button
			element(by.id('b2')).click(); // Next button
			//browser.sleep(300);
			element(by.id('b1')).click(); // Next button
			//browser.sleep(300);
			//element(by.css('a.btn.btn-primary.pull-right'))[0].click();
			element(by.partialButtonText('Ok')).click();


			// element(by.id('Ok')).click();

			var SigPad = element(by.id('shipper_sign'));
			var ele = browser.driver.findElement(By.id("shipper_sign"));
			// console.log(SigPad);


			browser.actions().mouseDown(element(by.id("shipper_sign")).getWebElement()).perform()
			browser.actions().mouseMove(element(by.id("shipper_sign")).getWebElement()).perform()
			browser.actions().mouseUp().perform()


			browser.actions()
				.mouseDown()
				.mouseMove(SigPad, {
					x: 352,
					y: 35
				})
				.mouseMove(SigPad, {
					x: 859,
					y: 45
				})
				.mouseMove(SigPad, {
					x: 752,
					y: 35
				})
				.mouseMove(SigPad, {
					x: 959,
					y: 45
				})
				.mouseUp()
				.click()
				.perform();

			// var signaturePad = new SignaturePad(SigPad);


			//


			element(by.id('b3')).click(); // Next button
			browser.sleep(20000);
		});

		// console.log(browser.getTitle());
	});



});

 sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator",
	"./BaseController"
],function(MessageBox, MessageToast, BusyIndicator, BaseController) {
	"use strict";
	
	return BaseController.extend("sfsfconcur.sap.comSFSF-Concur-Expenses.controller.Main", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sfsfconcur.sap.comSFSF-Concur-Expenses.view.ExpensesTimeline
		 */
			onInit: function() {
				
				// BusyIndicator.show();
				
				// var eventBus = sap.ui.getCore().getEventBus();
				// eventBus.subscribe("startup", "complete", function() {
				// 	var oBundle = this.getView().getModel("i18n").getResourceBundle();
				// 	var model = this.getView().getModel('expenses');
				// 	var that = this;
				// 	model.load()
				// 		.then(function() {
				// 			BusyIndicator.hide();
							
				// 			var msg = oBundle.getText('LoadCompleted');
				// 			MessageToast.show(msg);
				// 		})
				// 		.fail(function(error) {
				// 			BusyIndicator.hide();
				// 			that.errorMessage(error);
				// 		});
				// }, this);
			},

		onUsersClicked: function() {
			this.getRouter().navTo("users");
		},
		/**
		 *@memberOf sfsfconcur.sap.comSFSF-Concur-Expenses.controller.Main
		 */
		onReportsClicked: function() {
			this.getRouter().navTo("reports");
		}
	});
});
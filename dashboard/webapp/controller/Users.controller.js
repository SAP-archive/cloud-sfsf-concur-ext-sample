 sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"./BaseController"
], function(JSONModel, BaseController) {
	"use strict";

	return BaseController.extend("sfsfconcur.sap.comSFSF-Concur-Expenses.controller.Users", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sfsfconcur.sap.comSFSF-Concur-Expenses.view.Users
		 */
			// onInit: function() {
			// },

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf sfsfconcur.sap.comSFSF-Concur-Expenses.view.Users
		 */
			// onBeforeRendering: function() {
			// 	debugger;		
			// }

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf sfsfconcur.sap.comSFSF-Concur-Expenses.view.Users
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf sfsfconcur.sap.comSFSF-Concur-Expenses.view.Users
		 */
		//	onExit: function() {
		//
		//	}

	});

});
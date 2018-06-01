 sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"sfsfconcur/sap/comSFSF-Concur-Expenses/model/ExpensesModel"
], function(UIComponent, Device, JSONModel, ExpensesModel) {
	"use strict";

	return UIComponent.extend("sfsfconcur.sap.comSFSF-Concur-Expenses.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			this.setModel(oModel, "device");
			
			var oExpensesModel = new ExpensesModel();
			this.setModel(oExpensesModel, "expenses");
			
			this.getRouter().initialize();

			var eventBus = sap.ui.getCore().getEventBus();
			eventBus.publish("startup", "complete");			
		}
	});
});
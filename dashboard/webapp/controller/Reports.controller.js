 sap.ui.define([
	"./BaseController",
	"sap/ui/core/ValueState"
], function(BaseController, ValueState) {
	"use strict";

	return BaseController.extend("sfsfconcur.sap.comSFSF-Concur-Expenses.controller.Reports", {
		approvalStatus: function(value) {
			// Yes I know we could do 
			// oBundle.getText(value)
			// but this makes it more explicit
			
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (value) {
				case "A_AAFH":
					return oBundle.getText("A_AAFH");
				case "A_ACCO":
					return oBundle.getText("A_ACCO"); 
				case "A_EXTV":
					return oBundle.getText("A_EXTV");
				case "A_APPR":
					return oBundle.getText("A_APPR");
				case "A_FILE":
					return oBundle.getText("A_FILE");
				case "A_NOTF":
					return oBundle.getText("A_NOTF"); 
				case "A_PBDG":
					return oBundle.getText("A_PBDG");
				case "A_PECO":
					return oBundle.getText("A_PECO");
				case "A_PEND":
					return oBundle.getText("A_PEND");
				case "A_PVAL":
					return oBundle.getText("A_PVAL");
				case "A_RESU":
					return oBundle.getText("A_RESU");
				case "A_RHLD":
					return oBundle.getText("A_RHLD");
				case "A_TEXP":
					return oBundle.getText("A_TEXP");
				default:
					return oBundle.getText("A_UNKNOWN", value);
			}
		},
		
		approvalStatusState: function(value) {
			switch (value) {
				case "A_APPR":
				case "A_FILE":
				case "A_NOTF":	
				case "A_TEXP":
					return ValueState.Success;
				case "A_AAFH":
				case "A_ACCO":
				case "A_EXTV":
				case "A_RESU":
				case "A_RHLD":					
					return ValueState.Warning;
				case "A_PBDG":
				case "A_PECO":
				case "A_PEND":
				case "A_PVAL":
				default:
					return ValueState.Error;
			}			
		},
		
		paymentStatus: function(value) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			
			switch (value) {
				case "P_HOLD":
					return oBundle.geText("P_HOLD");
				case "P_NOTP":
					return oBundle.getText("P_NOTP");
				case "P_PAID":
					return oBundle.getText("P_PAID");
				case "P_PAYC":
					return oBundle.getText("P_PAYC");
				case "P_PROC":
					return oBundle.getText("P_PROC");
				default:
					return oBundle.getText("P_UNKNOWN", value);
			}
		},
		
		paymentStatusState: function(value) {
			switch (value) {
				case "P_HOLD":
					return ValueState.Warning;
				case "P_NOTP":
					return ValueState.Error;
				case "P_PAID":
					return ValueState.Success;
				case "P_PAYC":
					return ValueState.Success;
				case "P_PROC":
					return ValueState.none;
				default:
					return ValueState.Error;
			}
		}
		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sfsfconcur.sap.comSFSF-Concur-Expenses.view.Reports
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf sfsfconcur.sap.comSFSF-Concur-Expenses.view.Reports
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf sfsfconcur.sap.comSFSF-Concur-Expenses.view.Reports
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf sfsfconcur.sap.comSFSF-Concur-Expenses.view.Reports
		 */
		//	onExit: function() {
		//
		//	}

	});
});
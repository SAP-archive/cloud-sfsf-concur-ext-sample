 sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
    "sap/m/MessageBox"

], function (Controller, History, MessageBox) {
	"use strict";
	return Controller.extend("sfsfconcur.sap.comSFSF-Concur-Expenses.controller.BaseController", {

        errorMessage: function(msgObj) {
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

            var msg = oBundle.getText("UnableToLoadDataMsg");
            if (msgObj.msg) {
                msg = msgObj.msg;
            }

            MessageBox.show(msg, {
                icon: MessageBox.Icon.ERROR,
                title: oBundle.getText("UnableToLoadDataTitle"),
                actions: [MessageBox.Action.OK],
                id: "messageBoxId",
                defaultAction: sap.m.MessageBox.Action.OK,
                details: oBundle.getText("UnableToLoadDataDetails"),
                styleClass: bCompact ? "sapUiSizeCompact" : "",
                contentWidth: "100px"
            });
        },

		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("appHome", {}, true /*no history*/);
			}
		}
	});
});
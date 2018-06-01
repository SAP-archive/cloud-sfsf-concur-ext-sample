sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/m/Label",
	"sap/m/ColumnListItem",
	"sap/m/ListType",
	"sap/m/Column",
	"./BaseController"
], function(MessageBox, MessageToast, BusyIndicator, JSONModel, FlattenedDataset, FeedItem, Label, ColumnListItem, ListType, Column, BaseController) {
	"use strict";

	return BaseController.extend("sfsfconcur.sap.comSFSF-Concur-Expenses.controller.Dashboard", {
	
		/* ============================================================ */
		/* Constants                                                    */
		/* ============================================================ */
		/**
		 * Constants used in the example.
		 *
		 * @private
		 * @property {Object} vizFrame Viz Frame used in the view
		 * @property {String} vizFrame.id Id of the Viz Frame
		 * @property {Object} vizFrame.dataset Config used for the Viz Frame Flattened data
		 * @property {Object[]} vizFrame.dataset.dimensions Flattened data dimensions
		 * @property {Object[]} vizFrame.dataset.measures Flattened data measures
		 * @property {Object} vizFrame.dataset.data Flattened data other config
		 * @property {Object} vizFrame.dataset.data.path Flattened data path

		 * @property {String} vizFrame.type Viz Frame Type
		 * @property {Object} vizFrame.properties Viz Frame properties
		 * @property {Object} vizFrame.properties.plotArea Viz Frame plot area property
		 * @property {Object} vizFrame.properties.plotArea.showGap Viz Frame plot area property
		 * @property {Object[]} vizFrame.feedItems Viz Frame feed items

		 * @property {Object} table Table used in the view
		 * @property {String} table.id Id of the table
		 * @property {String} table.itemBindingPath Item binding path
		 * @property {String[]} table.columnLabelTexts Array of table column labels
		 * @property {String[]} table.columnLabelTexts Array of table template cell labels
		 */
		
		selectDepartments: function(evt) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			
			var departmentConfig = {
				vizFrame: {
					type: "column",
					dataset: {
						dimensions: [{
							name: 'department',
							value: "{name}"
							
						}],
						measures: [{
							group: 1,
							name: 'total',
							value: '{total}'
						}],
						data: {
							path: "/departments"
						}
					},
					properties: {
						plotArea: {
							showGap: true,
							dataLabel: {
								visible: true
							}
						},
						title: {
							text: oBundle.getText("departmentTitle")
						},
						valueAxis: {
							title: {
								text: oBundle.getText("departmentXAxixTitle")
							}
						},
						categoryAxis: {
							title: {
								text: oBundle.getText("departmentYAxisTitle")
							}
							
						}
					},
					feedItems: [{
						'uid': "primaryValues",
						'type': "Measure",
						'values': ["total"]
					}, {
						'uid': "axisLabels",
						'type': "Dimension",
						'values': ["department"]
					}]
				},
				customIcons: [
					{
						id: "users",
						src: "sap-icon://group",
						tooltip: oBundle.getText("iconUsersTooltipText"),
						pressMessage: oBundle.getText("iconUsersPressedText")
					},
					{
						id: "reports",
						src: "sap-icon://travel-expense-report",
						tooltip: oBundle.getText("iconReportsTooltipText"),
						pressMessage: oBundle.getText("iconReportsPressedText")
					},
					{
						id: "refresh",
						src: "sap-icon://refresh",
						tooltip: oBundle.getText("iconRefreshTooltipText"),
						pressMessage: oBundle.getText("iconRefreshPressedText")
					}
				],
				table: {
					itemBindingPath: "/departments",
					columnLabelTexts: [
						oBundle.getText("departmentColumnName"),
						oBundle.getText("departmentColumnCode"),
						oBundle.getText("departmentColumnExpenditure"),
						oBundle.getText("departmentColumnInterviews")
					],
					templateCellLabelTexts: ["{name}", "{code}", "{total}", "{count}"],
					model: "/"
				}
			}
		
			this._updateCustomIcons(departmentConfig.customIcons);
			this._updateVizFrame(departmentConfig.vizFrame);
			this._updateTable(departmentConfig.table);
		},

		selectDivisions: function(evt) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			
			var divisionConfig = {
				vizFrame: {
					dataset: {
						dimensions: [{
							name: 'division',
							value: "{name}"
							
						}],
						measures: [{
							group: 1,
							name: 'total',
							value: '{total}'
						}],
						data: {
							path: "/divisions"
						}
					},
					type: "column",
					properties: {
						plotArea: {
							showGap: true,
							dataLabel: {
								visible: true
							}
						},
						title: {
							text: oBundle.getText("divisionTitle")
						},
						valueAxis: {
							title: {
								text: oBundle.getText("divisionXAxixTitle")
							}
						},
						categoryAxis: {
							title: {
								text: oBundle.getText("divisionYAxisTitle")
							}
						}
					},
					feedItems: [{
						'uid': "primaryValues",
						'type': "Measure",
						'values': ["total"]
					}, {
						'uid': "axisLabels",
						'type': "Dimension",
						'values': ["division"]
					}]
				},
				customIcons: [
					{
						id: "users",
						src: "sap-icon://group",
						tooltip: oBundle.getText("iconUsersTooltipText"),
						pressMessage: oBundle.getText("iconUsersPressedText")
					},
					{
						id: "reports",
						src: "sap-icon://travel-expense-report",
						tooltip: oBundle.getText("iconReportsTooltipText"),
						pressMessage: oBundle.getText("iconReportsPressedText")
					},
					{
						id: "refresh",
						src: "sap-icon://refresh",
						tooltip: oBundle.getText("iconRefreshTooltipText"),
						pressMessage: oBundle.getText("iconRefreshPressedText")
					}
				],

				table: {
					itemBindingPath: "/divisions",
					columnLabelTexts: [
						oBundle.getText("divisionColumnName"),
						oBundle.getText("divisionColumnCode"),
						oBundle.getText("divisionColumnExpenditure"),
						oBundle.getText("divisionColumnInterviews")
					],
					templateCellLabelTexts: ["{name}", "{code}", "{total}", "{count}"],
					model: "/"
				}
			};
			
			this._updateCustomIcons(divisionConfig.customIcons);
			this._updateVizFrame(divisionConfig.vizFrame);
			this._updateTable(divisionConfig.table);
		},

		selectCountries: function(evt) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			
			var countryConfig = {
				vizFrame: {
					dataset: {
						dimensions: [{
							name: 'country',
							value: "{name}"
							
						}],
						measures: [{
							group: 1,
							name: 'total',
							value: '{total}'
						}],
						data: {
							path: "/countries"
						}
					},
					type: "column",
					properties: {
						plotArea: {
							showGap: true,
							dataLabel: {
								visible: true
							}
						},
						title: {
							text: oBundle.getText("countryTitle")
						},
						valueAxis: {
							title: {
								text: oBundle.getText("countryXAxixTitle")
							}
						},
						categoryAxis: {
							title: {
								text: oBundle.getText("countryYAxisTitle")
							}
						}
					},
					feedItems: [{
						'uid': "primaryValues",
						'type': "Measure",
						'values': ["total"]
					}, {
						'uid': "axisLabels",
						'type': "Dimension",
						'values': ["country"]
					}]
				},
				
				customIcons: [
					{
						id: "users",
						src: "sap-icon://group",
						tooltip: oBundle.getText("iconUsersTooltipText"),
						pressMessage: oBundle.getText("iconUsersPressedText")
					},
					{
						id: "reports",
						src: "sap-icon://travel-expense-report",
						tooltip: oBundle.getText("iconReportsTooltipText"),
						pressMessage: oBundle.getText("iconReportsPressedText")
					},
					{
						id: "refresh",
						src: "sap-icon://refresh",
						tooltip: oBundle.getText("iconRefreshTooltipText"),
						pressMessage: oBundle.getText("iconRefreshPressedText")
					}
				],

				table: {
					itemBindingPath: "/countries",
					columnLabelTexts: [
						oBundle.getText("countryColumnName"),
						oBundle.getText("countryColumnExpenditure"),
						oBundle.getText("countryColumnInterviews")
						],
					templateCellLabelTexts: ["{name}", "{total}", "{count}"],
					model: "/"
				}
			};
			
			this._updateCustomIcons(countryConfig.customIcons);
			this._updateVizFrame(countryConfig.vizFrame);
			this._updateTable(countryConfig.table);
		},

		selectLocations: function(evt) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			
			var locationConfig = {
				vizFrame: {
					dataset: {
						dimensions: [{
							name: 'location',
							value: "{name}"
							
						}],
						measures: [{
							group: 1,
							name: 'total',
							value: '{total}'
						}],
						data: {
							path: "/locations"
						}
					},
					type: "column",
					properties: {
						plotArea: {
							showGap: true,
							dataLabel: {
								visible: true
							}
						},
						title: {
							text: oBundle.getText("locationTitle")
						},
						valueAxis: {
							title: {
								text: oBundle.getText("locationXAxixTitle")
							}
						},
						categoryAxis: {
							title: {
								text: oBundle.getText("locationYAxisTitle")
							}
						}
					},
					feedItems: [{
						'uid': "primaryValues",
						'type': "Measure",
						'values': ["total"]
					}, {
						'uid': "axisLabels",
						'type': "Dimension",
						'values': ["location"]
					}]
				},
				
				customIcons: [
					{
						id: "users",
						src: "sap-icon://group",
						tooltip: oBundle.getText("iconUsersTooltipText"),
						pressMessage: oBundle.getText("iconUsersPressedText")
					},
					{
						id: "reports",
						src: "sap-icon://travel-expense-report",
						tooltip: oBundle.getText("iconReportsTooltipText"),
						pressMessage: oBundle.getText("iconReportsPressedText")
					},
					{
						id: "refresh",
						src: "sap-icon://refresh",
						tooltip: oBundle.getText("iconRefreshTooltipText"),
						pressMessage: oBundle.getText("iconRefreshPressedText")
					}
				],
	
				table: {
					itemBindingPath: "/locations",
					columnLabelTexts: [
						oBundle.getText("locationColumnName"),
						oBundle.getText("locationColumnCode"),
						oBundle.getText("locationColumnExpenditure"),
						oBundle.getText("locationColumnInterviews")

					],
					templateCellLabelTexts: ["{name}", "{code}", "{total}", "{count}"],
					model: "/"
				}
			};
			
			this._updateCustomIcons(locationConfig.customIcons);
			this._updateVizFrame(locationConfig.vizFrame);
			this._updateTable(locationConfig.table);
		},
		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * 
		 */
		onInit: function() {
			
			BusyIndicator.show();
			
			var eventBus = sap.ui.getCore().getEventBus();
			eventBus.subscribe("startup", "complete", function() {
				var oBundle = this.getView().getModel("i18n").getResourceBundle();
				var model = this.getView().getModel('expenses');
				var that = this;
				model.load()
					.then(function() {
						BusyIndicator.hide();
						
						var msg = oBundle.getText('LoadCompletedMsg');
						MessageToast.show(msg);
						
						// we now setup the table and view
						that.selectDepartments();
					})
					.fail(function(error) {
						BusyIndicator.hide();

                        that.errorMessage(error);
					});
			}, this);
		},

		/* ============================================================ */
		/* Helper Methods                                               */
		/* ============================================================ */
		/**
		 * Updated the Viz Frame in the view.
		 *
		 * @private
		 * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame that needs to be updated
		 */
		_updateVizFrame: function(config) {
			var oVizFrame = this.getView().byId('chartContainerVizFrame');
			
			oVizFrame.setVizProperties(config.properties);
			oVizFrame.setVizType(config.type);
			
			var oModel = this.getView().getModel('expenses');
			oVizFrame.setModel(oModel);
			
			var oDataset = new FlattenedDataset(config.dataset);
			
			oVizFrame.destroyFeeds();
			oVizFrame.destroyDataset();
			
			oVizFrame.setDataset(oDataset);
			this._addFeedItems(oVizFrame, config.feedItems);
		},
		
		onGotoUsers: function() {
			this.getRouter().navTo('users');
		},
		onGotoReports: function() {
			this.getRouter().navTo('reports');
		},
		
		_refresh: function() {
			var oModel = this.getView().getModel('expenses');
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this;
			
			BusyIndicator.show();
			oModel.refresh()
				.then(function() {
					BusyIndicator.hide();
					MessageToast.show(oBundle.getText("RefreshCompletedMsg"));
				})
				.fail(function(error) {
					BusyIndicator.hide();
					
					that.errorMessage(error);
				});
		},
		_updateCustomIcons: function(icons) {
			for (var i = 0; i < icons.length; i++) {
				var icon = icons[i];
				
				//var fnOnPress;
				
				var oIcon = this.getView().byId(icon.id);

				if (oIcon) {
					oIcon.setSrc(icon.src);
					oIcon.setTooltip(icon.tooltip);
					
					if (icon.id === 'users') {
						oIcon.attachPress(this.onGotoUsers, this);
					}
					
					if (icon.id === 'reports') {
						oIcon.attachPress(this.onGotoReports, this);
					}
					
					if (icon.id === 'refresh') {
						oIcon.attachPress(this._refresh, this);
					}
				}
			}
		},
		/**
		 * Updated the Table in the view.
		 *
		 * @private
		 * @param {sap.m.table} table Table that needs to be updated
		 */
		_updateTable: function(config) {
			var oTable = this.getView().byId('chartContainerContentTable');
			
			oTable.removeAllColumns();
			
			var aColumns = this._createTableColumns(config.columnLabelTexts);

			for (var i = 0; i < aColumns.length; i++) {
				oTable.addColumn(aColumns[i]);
			}

			var oTableTemplate = new ColumnListItem({
				type: ListType.Active,
				cells: this._createLabels(config.templateCellLabelTexts)
			});

			oTable.bindItems(config.itemBindingPath, oTableTemplate);
			
			var oModel = this.getView().getModel('expenses');
			oTable.setModel(oModel);
			
		},
		/**
		 * Adds the passed feed items to the passed Viz Frame.
		 *
		 * @private
		 * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame to add feed items to
		 * @param {Object[]} feedItems Feed items to add
		 */
		_addFeedItems: function(vizFrame, feedItems) {
			for (var i = 0; i < feedItems.length; i++) {
				vizFrame.addFeed(new FeedItem(feedItems[i]));
			}
		},
		/**
		 * Creates table columns with labels as headers.
		 *
		 * @private
		 * @param {String[]} labels Column labels
		 * @returns {sap.m.Column[]} Array of columns
		 */
		_createTableColumns: function(labels) {
			var aLabels = this._createLabels(labels);
			return this._createControls(Column, "header", aLabels);
		},
		/**
		 * Creates label control array with the specified texts.
		 *
		 * @private
		 * @param {String[]} labelTexts text array
		 * @returns {sap.m.Column[]} Array of columns
		 */
		_createLabels: function(labelTexts) {
			return this._createControls(Label, "text", labelTexts);
		},
		/**
		 * Creates an array of controls with the specified control type, property name and value.
		 *
		 * @private
		 * @param {sap.ui.core.Control} Control Control type to create
		 * @param {String} prop Property name
		 * @param {Array} propValues Value of the control's property
		 * @returns {sap.ui.core.Control[]} array of the new controls
		 */
		_createControls: function(Control, prop, propValues) {
			var aControls = [];
			var oProps = {};
			for (var i = 0; i < propValues.length; i++) {
				oProps[prop] = propValues[i];
				if (i === 0) {
					if (Control === sap.m.Label) {
						oProps['width'] = '100%';	
					} else {
						oProps['width'] = '33%';
					}
				} else {
					delete oProps.width;
				}
				
				aControls.push(new Control(oProps));
			}
			return aControls;
		}
	});

});
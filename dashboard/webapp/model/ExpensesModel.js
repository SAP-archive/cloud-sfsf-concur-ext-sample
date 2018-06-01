 sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/BindingMode"
], function(JSONModel, BindingMode) {
	"use strict";

	// For Cloud Foundry
	var CLOUD_FOUNDRY_API_ENDPOINT = "https://concur-sfsf-services.cfapps.us10.hana.ondemand.com";

	// For Docker
    // var CLOUD_FOUNDRY_API_ENDPOINT = "http://172.17.0.2:10010";

     // For running locally
	//var CLOUD_FOUNDRY_API_ENDPOINT = "http://127.0.0.1:10010";

	return JSONModel.extend("ExpensesModel", {
		constructor: function() {
			JSONModel.call(this);

			// one way as we do not push changes from the UI
			this.setDefaultBindingMode(BindingMode.OneWay);
		},
		
		_callService: function(sUrl) {
		  var def  =jQuery.Deferred();
		  
		jQuery.ajax({
			url: sUrl,
			cache: true,
			async: true,
			method: "GET",
			dataType: "json",
			success: function(data, status, jqXHR) {
				def.resolve(data);
			},
			error: function(jqXHR, status, error) {
				def.reject({status: status, msg: error.toString()});
			}
		});      	
		
		return def.promise();
		},
		
		_loadData: function() {
			var def = jQuery.Deferred();

			var departments = this._callService(CLOUD_FOUNDRY_API_ENDPOINT + '/departments');
			var divisions = this._callService(CLOUD_FOUNDRY_API_ENDPOINT + '/divisions');
			var countries = this._callService(CLOUD_FOUNDRY_API_ENDPOINT + '/countries');
			var locations = this._callService(CLOUD_FOUNDRY_API_ENDPOINT + '/locations');
			var users = this._callService(CLOUD_FOUNDRY_API_ENDPOINT + '/users');
			var reports = this._callService(CLOUD_FOUNDRY_API_ENDPOINT + '/reports');
			var status = this._callService(CLOUD_FOUNDRY_API_ENDPOINT + '/status');
			var totals = this._callService(CLOUD_FOUNDRY_API_ENDPOINT + '/totals');
		
			jQuery.when(departments, divisions, countries, locations, users, reports, totals, status)
		  		.then(function (departmentsData, divisionData, countriesData, locationsData, usersData, reportsData, totalsData, statusData) {
		  			var data = {
                        departments: departmentsData,
			  			divisions: divisionData,
			  			countries: countriesData,
			  			locations: locationsData,
			  			users: usersData,
			  			reports: reportsData,
			  			totals: totalsData,
			  			status: statusData
			  		};
			  		
			  		def.resolve(data);
		  		})
		  		.fail(function (error) {
		  			def.reject(error);
		  		});
		  	
		  return def.promise();
		},
      
	    load: function () {
	    	var def = jQuery.Deferred();
	    	
	    	var that = this;
	    	// load the data from success factors
	    	this._loadData()
                .then(function(data) {
                        jQuery.sap.log.info('SUCCESS loading data');
                        jQuery.sap.log.info(JSON.stringify(data, null, 2));
                        that.setData(data);
                        def.resolve(data);
                })
                .fail(function (error) {
                    jQuery.sap.log.error('ERROR loading data:' + error);
                    def.reject(error);
                });
    		
    		return def.promise();
		},
		refresh: function() {
			var that = this;
	      	var def = jQuery.Deferred();
	      	var sURL = CLOUD_FOUNDRY_API_ENDPOINT + "/refresh";
	      	
	    	jQuery.ajax({
	    		method: "POST",
	    		url: sURL,
	    		headers: {'content-type': 'application/json'},
	    		success: function() {
	    			// refreshed so now get the data
	    			that.load()
                        .then(function(data) {
                            def.resolve(data);
                        })
                        .fail(function(error) {
                            jQuery.sap.log.error('ERROR refreshing data:' + error);
                            def.reject(error);
                        });
	    		},
	    		error: function(jqXHR, status, error) {
	    		    var msg = error.toString();

	    		    if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
	    		        msg = jqXHR.responseJSON.message;
                    }

                    def.reject({status: jqXHR.status, msg: msg});
	    		}
	    	});
	
	      	return def.promise();
		}
	});
});
var express = require('express');
module.exports = {
    formDataTime: function () {
        var hrTime = process.hrtime();
        console.log(hrTime[0] * 1000000 + hrTime[1] / 1000);
        return hrTime[0] * 1000000 + hrTime[1] / 1000;
    },
    generatePrimaryKey: function () {
        var idKey =this.formDataTime()*1000*1000;
        console.log("idKey:" + idKey);
        return idKey;
    }
};

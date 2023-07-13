/** @odoo-module **/

import { registry } from "@web/core/registry";
const { Component, useState, onWillStart, onWillUnmount } = owl;
import rpc from 'web.rpc';
import { debounce } from "@web/core/utils/timing";
import ajax from 'web.ajax';
import { _t } from 'web.core';

const DEBOUNCE_RATE = 1;  // NOT Catch when user spam click, if you want to catch, change VALUE of DEBOUNCE_RATE (ms)
const REFRESH_RATE = 500; // 500ms
const DATETIME_OPTIONS = {
    hour: '2-digit',
    minute:'2-digit',
    second:'2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hourCycle: 'h23'
};
const DATETIME_LOCALES = "vi-VN";


    function newDateTime() {
        return new Date().toLocaleTimeString(DATETIME_LOCALES, DATETIME_OPTIONS)
    }

    function validateIsSuccess(isSuccess) {
        let notification = isSuccess ? _t("Success!"): _t("Cannot connect to machine!");
        alert(notification);
    }

export default class XChangeTimeDashboard extends Component {
    setup() {
        super.setup();
        this.state = useState({
            machines: [],
            currentTime: newDateTime(),
        });
        this.start_clock();

        onWillStart(async () => {
            return Promise.all([this._fetch_machine_data()]);
        });

        onWillUnmount(()=>{
            clearInterval(this.clock_start);
        });
    }

    start_clock () {
        this.clock_start = setInterval(()=> {
            this.state.currentTime = newDateTime();
        }, REFRESH_RATE)
    }

    async _fetch_machine_data() {
        let machines = await rpc.query({
            model: "x.machine",
            method: "search_read",
            fields: ['name', 'ip', 'port']
        });
        this.state.machines = machines;
    }

    onClickTestSound = debounce (async ()=> {
        const selectedMachine = document.getElementById("machines");
        const machineName = selectedMachine.options[selectedMachine.selectedIndex].text;
        let userChoice = await confirm(_t(`Do you want to test sound ? The sound will play in ${machineName}`));
        if(!userChoice)return ;
        const machineIp = document.getElementById("machines").value;
        let isSuccess = await ajax.jsonRpc('/erp_internal/test_voice', 'call', {
           ip: machineIp
        });
        validateIsSuccess(isSuccess);
    }, DEBOUNCE_RATE);

    onClickGetTime = debounce(async () =>{
        const selectedMachine = document.getElementById("machines");
        const machineName = selectedMachine.options[selectedMachine.selectedIndex].text;
        const machineTime = await ajax.jsonRpc('/erp_internal/get_time', 'call', {
           ip: selectedMachine.value
        });

        let notification = machineTime ? `${machineName}: ${machineTime}` : _t("Cannot connect to machine!");
        alert(notification);
    }, DEBOUNCE_RATE);

    onClickSetTime = debounce(async () =>{
        const selectedMachine = document.getElementById("machines");
        const newTime = document.getElementById("newTime").value;
        if (!newTime) {
            return alert(_t("You have to select time to change!"));
        }
        const isSuccess = await ajax.jsonRpc('/erp_internal/set_time', 'call', {
           ip: selectedMachine.value,
           newTime: newTime
        });
        validateIsSuccess(isSuccess);
    }, DEBOUNCE_RATE);

    onClickRollback = debounce(async () =>{
        const selectedMachine = document.getElementById("machines");
        const isSuccess = await ajax.jsonRpc('/erp_internal/rollback_time', 'call', {
           ip: selectedMachine.value,
           newTime: this.state.currentTime
        });
        validateIsSuccess(isSuccess);
    }, DEBOUNCE_RATE);

}

XChangeTimeDashboard.template = "erp_internal.dashboard";
registry.category("actions").add("erp_internal.dashboard", XChangeTimeDashboard);
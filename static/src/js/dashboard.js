/** @odoo-module **/

import { registry } from "@web/core/registry";
const { Component, useState, onWillStart, onWillUnmount } = owl;
import rpc from 'web.rpc';
import { debounce } from "@web/core/utils/timing";
import ajax from 'web.ajax';

export default class XChangeTimeDashboard extends Component {
    setup() {
        super.setup();
        this.state = useState({
            machines: [],
            currentTime: new Date().toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit', second:'2-digit', day: '2-digit', month: '2-digit', year: 'numeric', hourCycle: 'h23'}),
        })
        this.clock_start = setInterval(this.start_clock.bind(this), 500);

        onWillStart(async () => {
            return Promise.all([this._fetch_machine_data()])
        });
        onWillUnmount(()=>{clearInterval(this.clock_start)});
    }

    start_clock () {
        this.state.currentTime = new Date().toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit', second:'2-digit', day: '2-digit', month: '2-digit', year: 'numeric', hourCycle: 'h23'})
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
        const machineIp = document.getElementById("machines").value;
        let isSuccess = await ajax.jsonRpc('/erp_internal/test_voice', 'call', {
           ip: machineIp
        });
        let notification = isSuccess ? "Test voice successfully!": "Cannot connect to machine !";
        alert(notification);
    }, 500);

    onClickGetTime = debounce(async () =>{
        const selectedMachine = document.getElementById("machines");
        const machineName = selectedMachine.options[selectedMachine.selectedIndex].text;
        const machineTime = await ajax.jsonRpc('/erp_internal/get_time', 'call', {
           ip: selectedMachine.value
        });

        let notification = machineTime ? `${machineName}: ${machineTime}` : "Cannot connect to machine !";
        alert(notification);
    }, 500)

    onClickSetTime = debounce(async () =>{
        const selectedMachine = document.getElementById("machines");
        const newTime = document.getElementById("newTime").value;
        if (!newTime) {
            return alert("You have to select time to change!")
        }
        const isSuccess = await ajax.jsonRpc('/erp_internal/set_time', 'call', {
           ip: selectedMachine.value,
           newTime: newTime
        });
        let notification = isSuccess ? `Time changed !`: "Cannot connect to machine !";
        alert(notification);
    }, 500)

    onClickRollback = debounce(async () =>{
        const selectedMachine = document.getElementById("machines");
        const isSuccess = await ajax.jsonRpc('/erp_internal/rollback_time', 'call', {
           ip: selectedMachine.value,
           newTime: this.state.currentTime
        });
        let notification = isSuccess ? `Time changed !`: "Cannot connect to machine !";
        alert(notification);
    }, 500)

}

XChangeTimeDashboard.template = "erp_internal.dashboard";
registry.category("actions").add("erp_internal.dashboard", XChangeTimeDashboard);
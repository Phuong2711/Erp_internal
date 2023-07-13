# -*- coding: utf-8 -*-
import odoo.http as http
from zk import ZK, const
from datetime import datetime


class FingerScannerController(http.Controller):
    @http.route('/erp_internal/test_voice', type='json', auth='public', csrf=False)
    def test_voice(self, **kwargs):
        try:
            zk = ZK(kwargs.get("ip"), port=4370, timeout=5, password=0, force_udp=False, ommit_ping=False)
            connection = zk.connect()
            connection.test_voice(index=0)
            connection.disconnect()
            return True
        except Exception as e:
            return False

    @http.route('/erp_internal/get_time', type='json', auth='public', csrf=False)
    def get_time(self, **kwargs):
        try:
            zk = ZK(kwargs.get("ip"), port=4370, timeout=5, password=0, force_udp=False, ommit_ping=False)
            connection = zk.connect()
            machine_time = connection.get_time()
            connection.disconnect()
            return machine_time
        except Exception as e:
            return False

    @http.route('/erp_internal/set_time', type='json', auth='public', csrf=False)
    def set_time(self, **kwargs):
        try:
            zk = ZK(kwargs.get("ip"), port=4370, timeout=5, password=0, force_udp=False, ommit_ping=False)
            connection = zk.connect()
            new_dt = datetime.fromisoformat(kwargs.get("newTime"))
            connection.set_time(new_dt)
            connection.disconnect()
            return True
        except Exception as e:
            return False

    @http.route('/erp_internal/rollback_time', type='json', auth='public', csrf=False)
    def rollback_time(self, **kwargs):
        try:
            zk = ZK(kwargs.get("ip"), port=4370, timeout=5, password=0, force_udp=False, ommit_ping=False)
            connection = zk.connect()
            new_dt = datetime.strptime(kwargs.get("newTime"), "%H:%M:%S %d/%m/%Y")
            connection.set_time(new_dt)
            connection.disconnect()
            return True
        except Exception as e:
            return False

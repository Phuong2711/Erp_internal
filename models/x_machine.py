# -*- coding: utf-8 -*-
from odoo import api, fields, models
from odoo.exceptions import ValidationError


class XMachine(models.Model):
    _name = "x.machine"

    name = fields.Char("Name", required=True)
    ip = fields.Char("IP Address")
    port = fields.Char("Port")
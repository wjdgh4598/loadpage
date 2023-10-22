var node_template = {
    "model": {
        "pkey": "pkey",
        "rkey": "rkey",
        "mkey": "mkey",
        "order": [
            "orgSortOrder",
            "posCd",
            "dutyCd",
            "empId"
        ]
    },
    "template": {
        "nodes": {
            "photoType": {
                "units": [
                    {
                        "type": "text",
                        "binding": "orgNm",
                        "style": {
                            "backgroundColor": "#0082bc",
                            "borderColor": "#b1b1b1",
                            "borderRadius": "4 4 0 0",
                            "fontColor": "#ffffff",
                            "fontSize": 12,
                            "height": 35,
                            "width": 108,
                            "position": "0 0"
                        },
                        "name": "orgNm"
                    },
                    {
                        "binding": "empPhoto",
                        "name": "empPhoto",
                        "type": "picture",
                        "style": {
                            "borderColor": "#b1b1b1",
                            "height": 100,
                            "position": "20 35",
                            "width": 67
                        }
                    },
                    {
                        "type": "picture",
                        "binding": "cmpYn",
                        "relation": "empPhoto",
                        "relationAlign": "topLeft",
                        "style": {
                            "borderColor": "#b1b1b1",
                            "height": 14,
                            "width": 14,
                            "position": "-15 5",
                            "display": false,
                            "cursor": "pointer"
                        }
                    },
                    {
                        "binding": "dual",
                        "type": "text",
                        "style": {
                            "borderWidth": 2,
                            "borderColor": "#fff",
                            "backgroundColor": "green",
                            "fontColor": "#fff",
                            "fontSize": 9,
                            "borderRadius": 9,
                            "width": 18,
                            "height": 18,
                            "position": "77 112",
                            "display": false
                        }
                    },
                    {
                        "binding": "dutyNm",
                        "breakAll": true,
                        "style": {
                            "backgroundColor": "transparent",
                            "borderColor": "transparent",
                            "borderRadius": "0 0 0 8",
                            "fontSize": 12,
                            "height": 25,
                            "position": "1 130",
                            "width": 55
                        },
                        "type": "text"
                    },
                    {
                        "binding": "empNm",
                        "breakAll": true,
                        "style": {
                            "backgroundColor": "transparent",
                            "borderColor": "transparent",
                            "borderRadius": "0 0 8 0",
                            "fontSize": 12,
                            "height": 25,
                            "position": "56 130",
                            "width": 55
                        },
                        "type": "text"
                    }
                ],
                "style": {
                    "backgroundColor": "#FFFFFF",
                    "borderColor": "#b1b1b1",
                    "selectionBorderWidth": 6,
                    "borderRadius": 5,
                    "borderWidth": 1,
                    "height": 155,
                    "width": 110
                }
            },
            "photoTypeList": {
                "units": [
                    {
                        "type": "text",
                        "style": {
                            "backgroundColor": "#ffffff",
                            "borderColor": "#b1b1b1",
                            "borderRadius": 5,
                            "borderWidth": 1,
                            "height": 155,
                            "width": 125
                        },
                        "name": "orgNode"
                    },
                    {
                        "type": "text",
                        "binding": "orgNm",
                        "style": {
                            "backgroundColor": "#0082bc",
                            "borderColor": "#b1b1b1",
                            "borderRadius": "4 4 0 0",
                            "fontColor": "#ffffff",
                            "fontSize": 12,
                            "height": 35,
                            "width": 123,
                            "position": "1 1"
                        },
                        "name": "orgNm"
                    },
                    {
                        "binding": "empPhoto",
                        "name": "empPhoto",
                        "type": "picture",
                        "style": {
                            "borderColor": "#b1b1b1",
                            "height": 100,
                            "position": "28 36",
                            "width": 67
                        }
                    },
                    {
                        "type": "picture",
                        "binding": "cmpYn",
                        "relation": "empPhoto",
                        "relationAlign": "topLeft",
                        "style": {
                            "borderColor": "#b1b1b1",
                            "height": 14,
                            "width": 14,
                            "position": "-15 5",
                            "display": false,
                            "cursor": "pointer"
                        }
                    },
                    {
                        "binding": "dual",
                        "value": "겸",
                        "type": "text",
                        "style": {
                            "borderWidth": 2,
                            "borderColor": "#fff",
                            "backgroundColor": "green",
                            "fontColor": "#fff",
                            "fontSize": 9,
                            "borderRadius": 9,
                            "width": 18,
                            "height": 18,
                            "position": "85 113",
                            "display": false
                        }
                    },
                    {
                        "binding": "dutyNm",
                        "breakAll": true,
                        "style": {
                            "backgroundColor": "transparent",
                            "borderColor": "transparent",
                            "borderRadius": "0 0 0 8",
                            "fontSize": 12,
                            "height": 25,
                            "position": "8 131",
                            "width": 55
                        },
                        "type": "text"
                    },
                    {
                        "binding": "empNm",
                        "breakAll": true,
                        "style": {
                            "backgroundColor": "transparent",
                            "borderColor": "transparent",
                            "borderRadius": "0 0 8 0",
                            "fontSize": 12,
                            "height": 25,
                            "position": "57 131",
                            "width": 55
                        },
                        "type": "text"
                    },
                    {
                        "units": [
                            {
                                "binding": "posNm",
                                "breakAll": true,
                                "style": {
                                    "backgroundColor": "transparent",
                                    "borderColor": "transparent",
                                    "fontSize": 12,
                                    "height": 25,
                                    "position": "15 0",
                                    "width": 40
                                },
                                "type": "text"
                            },
                            {
                                "binding": "empNm",
                                "breakAll": true,
                                "style": {
                                    "backgroundColor": "transparent",
                                    "borderColor": "transparent",
                                    "fontSize": 12,
                                    "height": 25,
                                    "position": "60 0",
                                    "width": 47
                                },
                                "type": "text"
                            },
                            {
                                "type": "picture",
                                "binding": "cmpYn",
                                "style": {
                                    "borderColor": "#b1b1b1",
                                    "height": 12,
                                    "width": 12,
                                    "position": "2 6",
                                    "display": false,
                                    "cursor": "pointer"
                                }
                            },
                            {
                                "name": "dualPanel",
                                "style": {
                                    "backgroundColor": "transparent",
                                    "height": 25,
                                    "position": "105 0",
                                    "width": 18
                                },
                                "type": "text"
                            },
                            {
                                "binding": "dual",
                                "value": "겸",
                                "relation": "dualPanel",
                                "relationAlign": "topLeft",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "green",
                                    "fontColor": "#ffffff",
                                    "fontSize": 9,
                                    "borderRadius": 9,
                                    "width": 14,
                                    "height": 14,
                                    "position": "2 5",
                                    "display": false
                                }
                            }
                        ],
                        "type": "list",
                        "relation": "orgNode",
                        "relationAlign": "bottomLeft",
                        "style": {
                            "position": "0 4",
                            "backgroundColor": "#ffffff",
                            "borderColor": "#b1b1b1",
                            "borderWidth": 1,
                            "width": 125
                        }
                    }
                ],
                "style": {
                    "selectionBorderWidth": 6,
                    "borderRadius": 5
                }
            },
            "namecardType": {
                "units": [
                    {
                        "binding": "orgNm",
                        "name": "orgNm",
                        "verticalAlign": "center",
                        "type": "text",
                        "style": {
                            "backgroundColor": "#1d2b4d",
                            "borderRadius": 4,
                            "width": 278,
                            "height": 35,
                            "fontColor": "#ffffff",
                            "fontSize": 14,
                            "fontWeight": "bold",
                            "cursor": "pointer"
                        }
                    },
                    {
                        "units": [
                            {
                                "binding": "empPhoto",
                                "name": "empPhoto",
                                "imageStretch": "uniform2fill",
                                "type": "picture",
                                "style": {
                                    "position": "30 10",
                                    "width": 72,
                                    "height": 84
                                }
                            },
                            {
                                "type": "picture",
                                "binding": "cmpYn",
                                "relation": "empPhoto",
                                "relationAlign": "topLeft",
                                "style": {
                                    "borderColor": "#b1b1b1",
                                    "height": 14,
                                    "width": 14,
                                    "position": "-15 5",
                                    "display": false,
                                    "cursor": "pointer"
                                }
                            },
                            {
                                "binding": "dual",
                                "value": "겸",
                                "relation": "empPhoto",
                                "relationAlign": "bottomRight",
                                "verticalAlign": "center",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "green",
                                    "borderColor": "#FFFFFF",
                                    "borderRadius": 10,
                                    "borderWidth": 2,
                                    "width": 20,
                                    "height": 20,
                                    "fontColor": "#ffffff",
                                    "fontSize": 12,
                                    "position": "-10 -15",
                                    "display": false
                                }
                            },
                            {
                                "binding": "bind01",
                                "name": "bind01",
                                "relation": "empPhoto",
                                "relationAlign": "topRight",
                                "horizontalAlign": "left",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "transparent",
                                    "fontColor": "#333333",
                                    "fontSize": 14,
                                    "fontWeight": "bold",
                                    "position": "30 -5",
                                    "height": 20,
                                    "width": 146
                                }
                            },
                            {
                                "binding": "bind02",
                                "name": "bind02",
                                "relation": "bind01",
                                "relationAlign": "bottomLeft",
                                "horizontalAlign": "left",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "transparent",
                                    "fontColor": "#333333",
                                    "fontSize": 14,
                                    "fontWeight": "bold",
                                    "height": 20,
                                    "width": 146
                                }
                            },
                            {
                                "binding": "bind03",
                                "name": "bind03",
                                "relation": "bind02",
                                "relationAlign": "bottomLeft",
                                "horizontalAlign": "left",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "transparent",
                                    "fontColor": "#333333",
                                    "fontSize": 14,
                                    "fontWeight": "bold",
                                    "height": 20,
                                    "width": 146
                                }
                            },
                            {
                                "binding": "bind04",
                                "name": "bind04",
                                "relation": "bind03",
                                "relationAlign": "bottomLeft",
                                "horizontalAlign": "left",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "transparent",
                                    "fontColor": "#333333",
                                    "fontSize": 14,
                                    "fontWeight": "bold",
                                    "height": 20,
                                    "width": 146
                                }
                            },
                            {
                                "binding": "bind05",
                                "name": "bind05",
                                "relation": "bind04",
                                "relationAlign": "bottomLeft",
                                "horizontalAlign": "left",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "transparent",
                                    "fontColor": "#333333",
                                    "fontSize": 14,
                                    "fontWeight": "bold",
                                    "height": 20,
                                    "width": 146
                                }
                            }
                        ],
                        "type": "panel",
                        "name": "orgPanel",
                        "relation": "orgNm",
                        "relationAlign": "bottomLeft",
                        "style": {
                            "position": "0 0",
                            "height": 110,
                            "width": 278
                        }
                    }
                ],
                "style": {
                    "backgroundColor": "linear, #DFDFDF(left),#FFFFFF(right)",
                    "borderColor": "#b1b1b1",
                    "borderRadius": 5,
                    "borderWidth": 1,
                    "height": 145,
                    "width": 280
                }
            },
            "namecardTypeList": {
                "units": [
                    {
                        "units": [
                            {
                                "binding": "orgNm",
                                "name": "orgNm",
                                "verticalAlign": "center",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "#1d2b4d",
                                    "borderRadius": 4,
                                    "width": 278,
                                    "height": 35,
                                    "fontColor": "#ffffff",
                                    "fontSize": 14,
                                    "fontWeight": "bold",
                                    "cursor": "pointer"
                                }
                            },
                            {
                                "binding": "empPhoto",
                                "name": "empPhoto",
                                "relation": "orgNm",
                                "relationAlign": "bottomLeft",
                                "imageStretch": "uniform2fill",
                                "type": "picture",
                                "style": {
                                    "position": "30 10",
                                    "width": 72,
                                    "height": 84
                                }
                            },
                            {
                                "type": "picture",
                                "binding": "cmpYn",
                                "relation": "empPhoto",
                                "relationAlign": "topLeft",
                                "style": {
                                    "borderColor": "#b1b1b1",
                                    "height": 14,
                                    "width": 14,
                                    "position": "-15 5",
                                    "display": false,
                                    "cursor": "pointer"
                                }
                            },
                            {
                                "binding": "dual",
                                "value": "겸",
                                "relation": "empPhoto",
                                "relationAlign": "bottomRight",
                                "verticalAlign": "center",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "green",
                                    "borderColor": "#FFFFFF",
                                    "borderRadius": 10,
                                    "borderWidth": 2,
                                    "width": 20,
                                    "height": 20,
                                    "fontColor": "#ffffff",
                                    "fontSize": 12,
                                    "position": "-10 -15",
                                    "display": false
                                }
                            },
                            {
                                "binding": "bind01",
                                "name": "bind01",
                                "relation": "empPhoto",
                                "relationAlign": "topRight",
                                "horizontalAlign": "left",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "transparent",
                                    "fontColor": "#333333",
                                    "fontSize": 14,
                                    "fontWeight": "bold",
                                    "position": "30 -5",
                                    "height": 20,
                                    "width": 146
                                }
                            },
                            {
                                "binding": "bind02",
                                "name": "bind02",
                                "relation": "bind01",
                                "relationAlign": "bottomLeft",
                                "horizontalAlign": "left",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "transparent",
                                    "fontColor": "#333333",
                                    "fontSize": 14,
                                    "fontWeight": "bold",
                                    "height": 20,
                                    "width": 146
                                }
                            },
                            {
                                "binding": "bind03",
                                "name": "bind03",
                                "relation": "bind02",
                                "relationAlign": "bottomLeft",
                                "horizontalAlign": "left",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "transparent",
                                    "fontColor": "#333333",
                                    "fontSize": 14,
                                    "fontWeight": "bold",
                                    "height": 20,
                                    "width": 146
                                }
                            },
                            {
                                "binding": "bind04",
                                "name": "bind04",
                                "relation": "bind03",
                                "relationAlign": "bottomLeft",
                                "horizontalAlign": "left",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "transparent",
                                    "fontColor": "#333333",
                                    "fontSize": 14,
                                    "fontWeight": "bold",
                                    "height": 20,
                                    "width": 146
                                }
                            },
                            {
                                "binding": "bind05",
                                "name": "bind05",
                                "relation": "bind04",
                                "relationAlign": "bottomLeft",
                                "horizontalAlign": "left",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "transparent",
                                    "fontColor": "#333333",
                                    "fontSize": 14,
                                    "fontWeight": "bold",
                                    "height": 20,
                                    "width": 146
                                }
                            }
                        ],
                        "type": "panel",
                        "name": "orgPanel",
                        "style": {
                            "backgroundColor": "linear, #DFDFDF(left),#FFFFFF(right)",
                            "borderColor": "#b1b1b1",
                            "borderRadius": 5,
                            "borderWidth": 1,
                            "height": 145,
                            "width": 280
                        }
                    },
                    {
                        "units": [
                            {
                                "binding": "lineh",
                                "type": "lineh",
                                "style": {
                                    "borderWidth": 0.5,
                                    "borderColor": "#b1b1b1",
                                    "width": 278,
                                    "display": true
                                }
                            },
                            {
                                "binding": "empPhoto",
                                "name": "listEmpPhoto",
                                "imageStretch": "uniform2fill",
                                "type": "picture",
                                "style": {
                                    "position": "30 10",
                                    "width": 72,
                                    "height": 84
                                }
                            },
                            {
                                "type": "picture",
                                "binding": "cmpYn",
                                "relation": "listEmpPhoto",
                                "relationAlign": "topLeft",
                                "style": {
                                    "borderColor": "#b1b1b1",
                                    "height": 14,
                                    "width": 14,
                                    "position": "-15 5",
                                    "display": false,
                                    "cursor": "pointer"
                                }
                            },
                            {
                                "binding": "dual",
                                "value": "겸",
                                "relation": "listEmpPhoto",
                                "relationAlign": "bottomRight",
                                "verticalAlign": "center",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "green",
                                    "borderColor": "#FFFFFF",
                                    "borderRadius": 10,
                                    "borderWidth": 2,
                                    "width": 20,
                                    "height": 20,
                                    "fontColor": "#ffffff",
                                    "fontSize": 12,
                                    "position": "-10 -15",
                                    "display": false
                                }
                            },
                            {
                                "binding": "bind01",
                                "name": "listBind01",
                                "relation": "listEmpPhoto",
                                "relationAlign": "topRight",
                                "horizontalAlign": "left",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "transparent",
                                    "fontColor": "#333333",
                                    "fontSize": 14,
                                    "fontWeight": "bold",
                                    "position": "30 -5",
                                    "height": 20,
                                    "width": 146
                                }
                            },
                            {
                                "binding": "bind02",
                                "name": "listBind02",
                                "relation": "listBind01",
                                "relationAlign": "bottomLeft",
                                "horizontalAlign": "left",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "transparent",
                                    "fontColor": "#333333",
                                    "fontSize": 14,
                                    "fontWeight": "bold",
                                    "height": 20,
                                    "width": 146
                                }
                            },
                            {
                                "binding": "bind03",
                                "name": "listBind03",
                                "relation": "listBind02",
                                "relationAlign": "bottomLeft",
                                "horizontalAlign": "left",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "transparent",
                                    "fontColor": "#333333",
                                    "fontSize": 14,
                                    "fontWeight": "bold",
                                    "height": 20,
                                    "width": 146
                                }
                            },
                            {
                                "binding": "bind04",
                                "name": "listBind04",
                                "relation": "listBind03",
                                "relationAlign": "bottomLeft",
                                "horizontalAlign": "left",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "transparent",
                                    "fontColor": "#333333",
                                    "fontSize": 14,
                                    "fontWeight": "bold",
                                    "height": 20,
                                    "width": 146
                                }
                            },
                            {
                                "binding": "bind05",
                                "name": "listBind05",
                                "relation": "listBind04",
                                "relationAlign": "bottomLeft",
                                "horizontalAlign": "left",
                                "type": "text",
                                "style": {
                                    "backgroundColor": "transparent",
                                    "fontColor": "#333333",
                                    "fontSize": 14,
                                    "fontWeight": "bold",
                                    "height": 20,
                                    "width": 146
                                }
                            }
                        ],
                        "type": "list",
                        "relation": "orgPanel",
                        "relationAlign": "bottomLeft",
                        "style": {
                            "position": "0 4",
                            "backgroundColor": "linear, #DFDFDF(left),#FFFFFF(right)",
                            "borderColor": "#b1b1b1",
                            "borderRadius": 0,
                            "borderWidth": 1,
                            "width": 280
                        }
                    }
                ],
                "style": {
                    "width": 280
                }
            }
        }
    }
}
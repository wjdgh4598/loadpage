var _data_map = {
    "org": [{
        code: "orgId",
        name: "조직코드",
        alias: {
            code: "orgCode"
        }
    },
    {
        code: "upOrgId",
        name: "상위조직코드",
        alias: {
            code: "orgCodeUp"
        }
    },
    {
        code: "orgNm",
        name: "조직명",
        alias: {
            code: "orgNameHan"
        },
        convert: function (row) {
            return (row.orgNameHan || "");
        }
    },
    {
        code: "orgLv",
        name: "조직레벨",
        alias: {
            code: "levelCode"
        }
    },
    {
        code: "leaderId",
        name: "조직장",
        alias: {
            code: "ldrEmplNo"
        }
    },
    {
        code: "orgSortOrder",
        name: "조직명",
        alias: {
            code: "displayOrder"
        }
    }],
    "emp": [
    {
        code: "empNm",
        name: "성명",
        info: true,
        alias: {
            code: "emplNameHan"
        }
    },
    {
        code: "empId",
        name: "사번",
        info: true,
        alias: {
            code: "emplNo"
        }
    },
    {
        code: "empPhoto",
        name: "사진",
        alias: {
            code: "imageUrl"
        }
    },
    {
        code: "orgId",
        name: "조직코드",
        alias: {
            code: "orgCode"
        }
    },
    {
        code: "orgNm",
        name: "조직명",
        alias: {
            code: "orgNameHan"
        },
        convert: function (row) {
            return (row.orgNameHan || "");
        }
    },
    {
        code: "posCd",
        name: "직위코드",
        alias: {
            code: "positionCode"
        },
        convert: function (row) {
            return (row.positionCode || "");
        }
    },
    {
        code: "posNm",
        name: "직위",
        info: true,
        alias: {
            code: "positionNameHan"
        },
        convert: function (row) {
            return (row.positionNameHan || "");
        }
    },
    {
        code: "dutyCd",
        name: "직책코드",
        alias: {
            code: "gradeCode"
        },
        convert: function (row) {
            return (row.gradeCode || "");
        }
    },
    {
        code: "dutyNm",
        name: "직책",
        info: true,
        alias: {
            code: "titleNameHan"
        },
        convert: function (row) {
            return (row.titleNameHan || "");
        }
    },
    {
        code: "entDate",
        name: "입사일",
        info: true,
        alias: {
            code: "entranceDate"
        },
        convert: function (row) {
            return dayjs(row.entranceDate).format('YYYY-MM-DD');
        }
    },
    {
        code: "bind01",
        name: "성명",
        alias: {
            code: "emplNameHan"
        },
        convert: function (row) {
            return ["성명", row.emplNameHan].join(": ");
        }
    },
    {
        code: "bind02",
        name: "사번",
        alias: {
            code: "emplNo"
        },
        convert: function (row) {
            return ["사번", row.emplNo].join(": ");
        }
    },
    {
        code: "bind03",
        name: "직위",
        alias: {
            code: "positionNameHan"
        },
        convert: function (row) {
            return ["직위", row.positionNameHan].join(": ");
        }
    },
    {
        code: "bind04",
        name: "직책",
        alias: {
            code: "titleNameHan"
        },
        convert: function (row) {
            return ["직책", row.titleNameHan].join(": ");
        }
    },
    {
        code: "bind05",
        name: "입사일",
        alias: {
            code: "entranceDate"
        },
        convert: function (row) {
            var date = dayjs(row.entranceDate).format('YYYY-MM-DD');
            return ["입사일", date].join(": ");
        }
    }]
}
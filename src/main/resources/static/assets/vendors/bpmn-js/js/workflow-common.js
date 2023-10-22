/*
 * 워크플로우에서 공통적으로 사용하는 스크립트를 모아놓은 js
 */
var ACTI_TEMPLATE =
    '<div class="bpmn-overlay">'+
      '<div class="activity-center-left-position activity-overlay">'+
        '<span class="activity-tag">{{activity-id}}</span>'+
      '</div>'+
    '</div>';

var INST_TEMPLATE =
    '<div class="bpmn-overlay">'+
      '<div id="badge{{activity-id}}" class="activity-bottom-left-position instances-overlay">'+
        '<span class="badge circle instance-count is-primary"></span>'+
        '<span class="badge circle incident-count is-secondary"></span>'+
      '</div>'+
    '</div>';

var WorkflowUtils = (function() {


    return {
        drawBpmn: async function (viewer, data, callback) {
            viewer.clear();
            // import a BPMN 2.0 diagram
            try {
                await viewer.importXML(data.bpmnXML);

                var canvas = viewer.get('canvas');
                WorkflowUtils.drawActiId(viewer);

                // zoom to fit full viewport
                canvas.zoom('fit-viewport', 'auto');

                if(Object.prototype.toString.call(data.taskInstance) == '[object Object]'
                        || Object.prototype.toString.call(data.taskIncident) == '[object Object]') {
                    WorkflowUtils.drawInstanceCnt(viewer, data.taskInstance, data.taskIncident);
                }
                if(typeof callback == 'function') {
                    callback();
                }
            } catch (err) {
                console.log(err.message, err.warnings);
            }
        },
        drawActiId: function(viewer) {
            var canvas = viewer.get('canvas');
            var overlays = viewer.get('overlays');
            var elementRegistry = viewer.get('elementRegistry');
            var elements = elementRegistry.filter(function(element) {
                var bo = (element && element.businessObject) || element;
                return bo && (typeof bo.$instanceOf === 'function') && (bo.$instanceOf('bpmn:UserTask') || bo.$instanceOf('bpmn:ServiceTask') || bo.$instanceOf('bpmn:BusinessRuleTask'));
            });

            for(var i = 0; i < elements.length; i++) {
                overlays.add(elements[i].id, {
                    position: {
                        top: 55,
                        left: 0
                    },
                    html: ACTI_TEMPLATE.replaceAll('{{activity-id}}', elements[i].id)
                });

                overlays.add(elements[i].id, {
                    position: {
                      bottom: 12,
                      left: 0
                    },
                    html: INST_TEMPLATE.replaceAll('{{activity-id}}', elements[i].id)
                });
            }
        },
        drawInstanceCnt: function(viewer, taskInstance, taskIncident) {
            if(Object.prototype.toString.call(taskInstance) == '[object Object]') {
                for(var key in taskInstance) {
                    $(viewer._container).find('#badge'+key+' > span.instance-count').text(taskInstance[key])
                }
            }
            if(Object.prototype.toString.call(taskIncident) == '[object Object]') {
                for(var key in taskIncident) {
                    $(viewer._container).find('#badge'+key+' > span.incident-count').text(taskIncident[key])
                }
            }
        },
        getProcessDefinition: function(viewer) {
            return viewer.getDefinitions().rootElements.filter(function(v) {
                return v.$type == 'bpmn:Process'
            })[0];
        },
        getProcessDefinitionName: function(viewer) {
            var definition = WorkflowUtils.getProcessDefinition(viewer);
            return definition.name;
        }
    };
})();
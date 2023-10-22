/**
 * required lib : jquery3.4.1, jquery-ui1.12.1
 * 스크립트 객체가 드래그앤 드랍으로 움직이는 함수.
 * 클래스로 구현하려 했으나 ie에서 미지원해서 function으로 구현
 * @author es-seungglee
 */

function DragAndDrop(targetEl, sourceEl, originList, destList) {
    let _list = targetEl;
    let _child = sourceEl;
    let _selectedIndex = -1;
    let _selectedList = [];     
    let _choiceList = [];       
    let _originList = originList;
    setChildDraggable();

    setChildClick();

    function selectTo (idx){
        let fieldIdx = idx;
    
        if(typeof(idx) == 'object'){
            fieldIdx = idx.index(); 
        }
    
        if(_selectedIndex == -1) {
            _selectedIndex = 0;
        }
        let children = _list.children();
        if(fieldIdx > _selectedIndex) {
            for(var counter = _selectedIndex; counter < children.length; counter++){
                if(counter <= fieldIdx) {
                    children.eq(counter).addClass("fc-selected");
                    _selectedList.push(_originList[counter]);
                }else {
                    children.eq(counter).removeClass("fc-selected");
                }
            }
        } else {
            for (var counter = _selectedIndex; counter >= 0; counter--) {
                if (counter >= fieldIdx) {
                    children.eq(counter).addClass("fc-selected");
                    _selectedList.push(_originList[counter]);
                } else {
                    children.eq(counter).removeClass("fc-selected");
                }
            }
        }
    }
    
    function toggleFieldSelection (field) {
        field.toggleClass("fc-selected");
        if(field.hasClass("fc-selected")) {
            _selectedIndex = field.index(); 
            _selectedList.push(_originList[_selectedIndex]);
        } else {
            let origin = _originList[_selectedIndex];
            let idx = _selectedList.indexOf(origin); 
            if(idx != -1) {
                _selectedList.splice(idx, 1);
            }
            if(_selectedIndex == field.index()) {
                _selectedIndex = list.children(".fc-selected").first().indx();
            }
        }
    }
    
    function selectField (field){
        clearSelection();
        field.addClass("fc-selected");
        _selectedIndex = field.index();
        _selectedList.push(_originList[_selectedIndex]);
    }
    
    function clearSelection() {
        _selectedList = [];
        _list.children().removeClass("fc-selected");
    }
    
    this.clearSelection = clearSelection;    

    this.setSelectedList = function(list){
        _selectedList = list;
    }

    this.getSelectedList = function(){
        return _selectedList;
    }

    function setChildDraggable() {
        if(destList) {
	
            _child.draggable({
                connectToSortable : destList,
                helper : "clone",
                drag : function(){
                    if(_selectedList.length == 0) {
                        selectField($(this));
                    }else if(_selectedList.length == 1 && _selectedIndex != $(this).index()) {
                        clearSelection();
                        _selectedList.push(_originList[$(this).index()]);
                        $(this).addClass("fc-selected");
                    }
                }
            })
            $(destList).droppable({
                drop : function(){
                    pushChoiceList();
                }
                ,hoverClass : "drop--hover"
            });
            
        }
    }

    function pushChoiceList() {
        for(let i=0; i< _selectedList.length; i++) {
            _choiceList.push(_selectedList[i]);
        }
        
        makeChoiceHtml(_choiceList);
        clearSelection();
    }

    this.pushChoiceList = function () {
        pushChoiceList();
        return _selectedList;
    }

    function setChildClick() {
        _child.on("click",function(event) {
            if(event.ctrlKey || event.metaKey) {
                toggleFieldSelection($(this));
            }else if(event.shiftKey) {
                selectTo($(this));
            }else {
                selectField($(this));
            }
        });
		
        _child.on("dblclick",function() {
            if(destList) {
                pushChoiceList();
            }else {
                //_originList.splice($(this).index(), 1);
                //makeChoiceHtml(_originList);
            }
        });
        
    }

    this.setOriginList = function(list, child) {
        _originList = list;
        _child = child;
        setChildDraggable();
        setChildClick();
    }

    this.setChoiceList = function(list){
        _choiceList = list;
    }

    this.getChoiceList = function(){
        return _choiceList;
    }

    this.setChoiceList = function(list) {
        _choiceList = list;
    }

    return this;
}


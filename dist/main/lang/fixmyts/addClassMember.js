var ts = require("typescript");
var ast = require("./astUtils");
var AddClassMember = (function () {
    function AddClassMember() {
        this.key = AddClassMember.name;
    }
    AddClassMember.prototype.canProvideFix = function (info) {
        var relevantError = info.positionErrors.filter(function (x) { return x.code == 2339; })[0];
        if (!relevantError)
            return;
        if (info.positionNode.kind !== 65)
            return;
        return "Add Member to Class";
    };
    AddClassMember.prototype.provideFix = function (info) {
        var relevantError = info.positionErrors.filter(function (x) { return x.code == 2339; })[0];
        var errorText = relevantError.messageText;
        if (typeof errorText !== 'string') {
            console.error('I have no idea what this is:', errorText);
            return [];
        }
        ;
        var identifier = info.positionNode;
        var identifierName = identifier.text;
        var typeName = errorText.match(/Property \'(\w+)\' does not exist on type \'(\w+)\'./)[2];
        var classNode = ast.getNodeByKindAndName(info.program, 201, typeName);
        var firstBrace = classNode.getChildren().filter(function (x) { return x.kind == 14; })[0];
        var refactoring = {
            span: {
                start: firstBrace.end,
                length: 0
            },
            newText: identifierName + ":any;",
            filePath: classNode.getSourceFile().fileName
        };
        return [refactoring];
    };
    return AddClassMember;
})();
exports.default = AddClassMember;

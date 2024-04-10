
export function permission(param: any) {
    const arrayPermission = [8];

    const isParamInArray = arrayPermission.includes(param);

    return isParamInArray;
}

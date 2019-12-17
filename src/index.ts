const isUndefined = (value: any) => value === undefined;

const isNull = (value: any) => value === null;

const isObject = (value: any) => value === Object(value);

const isArray = (value: any) => Array.isArray(value);

const isDate = (value: any) => value instanceof Date;

const isBlob = (value: any) =>
    value && typeof value.size === 'number' && typeof value.type === 'string' && typeof value.slice === 'function';

const isFile = (value: any) =>
    isBlob(value) &&
    typeof value.name === 'string' &&
    (typeof value.lastModifiedDate === 'object' || typeof value.lastModified === 'number');

export const objectToFormData = (obj: any, cfg?: any, fd?: any, pre?: any): FormData => {
    cfg = cfg || {};
    cfg.indices = isUndefined(cfg.indices) ? false : cfg.indices;
    cfg.nullsAsUndefineds = isUndefined(cfg.nullsAsUndefineds) ? false : cfg.nullsAsUndefineds;
    fd = fd || new FormData();

    if (isUndefined(obj)) {
        return fd;
    } else if (isNull(obj)) {
        if (!cfg.nullsAsUndefineds) {
            fd.append(pre, '');
        }
    } else if (isArray(obj)) {
        if (!obj.length) {
            const key = pre + '[]';

            fd.append(key, '');
        } else {
            obj.forEach((value: any, index: any) => {
                const key = pre + '[' + (cfg.indices ? index : '') + ']';

                objectToFormData(value, cfg, fd, key);
            });
        }
    } else if (isDate(obj)) {
        fd.append(pre, obj.toISOString());
    } else if (isObject(obj) && !isFile(obj) && !isBlob(obj)) {
        Object.keys(obj).forEach(prop => {
            const value = obj[prop];

            if (isArray(value)) {
                while (prop.length > 2 && prop.lastIndexOf('[]') === prop.length - 2) {
                    prop = prop.substring(0, prop.length - 2);
                }
            }

            const key = pre ? pre + '[' + prop + ']' : prop;

            objectToFormData(value, cfg, fd, key);
        });
    } else {
        fd.append(pre, obj);
    }

    return fd;
};

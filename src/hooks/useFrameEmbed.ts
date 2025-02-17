import { createSearchParams, useSearchParams } from 'react-router-dom';

/**
 * 当前约定好的集成者标识
 * 如果有新的接入项目可以在下面追加
 */
export enum EmbedType {
  /** 政府端协议管理 */
  GovProtocol = 'govProtocol',
}

export const EMBED_SEARCH_KEY = 'SsoSource';

/**
 * 检查当前页面是否通过 iframe 被其他页面集成
 *
 * 规则：当 url 里出现 ?embed=xxx 时就认为被集成，后面的 xxx 将作为集成者的标识（提前约定好），例如：?embed=park-portal 代表被园区门户集成
 */
export const useFrameEmbed = () => {
  const [searchParams] = useSearchParams();

  const embedType = searchParams.get(EMBED_SEARCH_KEY) as EmbedType;
  const isEmbed = !!embedType;
  const isEmbedByGovProtocol = embedType === EmbedType.GovProtocol;

  const getEmbedSearchParams = () => {
    if (!embedType) return undefined;
    return createSearchParams({ [EMBED_SEARCH_KEY]: embedType }).toString();
  };

  return {
    /** 是否被集成 */
    isEmbed,
    /** 政府端协议管理 */
    isEmbedByGovProtocol,
    /** 集成者的标识 */
    embedType,
    /** 获取页面集成相关的 url 参数，一般用于应用内 navigate */
    getEmbedSearchParams,
  };
};

/**
 * iframe 内外通信事件
 */
export enum EmbedEventType {
  /** 请求登录 */
  RequireLogin = 'requireLogin',
  /** 请求外部单点跳转 */
  RequireSsoNavigate = 'requireSsoNavigate',
}

/**
 * 把指定信息转发到父窗口
 * 一般用于登录组件通过 iframe 嵌入到其他项目中时使用
 *
 * @param type 该事件的类型（可随意填写，用于外界窗口对信息进行区分）
 * @param payload 该事件的数据
 */
export const forwardOutside = (type: EmbedEventType, payload: unknown) => {
  if (!window.parent || !window.parent.postMessage) {
    console.error('转发失败，找不到 postMessage 方法');
    return;
  }

  console.log('对外 post message', type, payload);
  window.parent.postMessage({ type, payload }, '*');
};

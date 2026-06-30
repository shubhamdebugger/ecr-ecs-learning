import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';
import { Request } from 'express';
import { ClickData } from '../types/url.types';

export const parseUserAgent = (req: Request): ClickData => {
  const userAgent = req.headers['user-agent'] ?? '';
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const browserName = result.browser.name ?? 'unknown';
  const osName = result.os.name ?? 'unknown';

  let device: 'desktop' | 'mobile' | 'tablet' | 'unknown' = 'unknown';
  if (result.device.type === 'mobile') device = 'mobile';
  else if (result.device.type === 'tablet') device = 'tablet';
  else if (result.device.type === undefined && osName !== 'unknown') device = 'desktop';

  const ip = getClientIp(req);
  const geo = ip ? geoip.lookup(ip) : null;
  const country = geo?.country ?? 'unknown';

  const referrer =
    (req.headers.referer as string) || (req.headers.referrer as string) || 'direct';

  return {
    ip: ip ?? 'unknown',
    browser: browserName,
    os: osName,
    device,
    referrer,
    country,
  };
};

const getClientIp = (req: Request): string | null => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',');
    return ips[0].trim();
  }
  return req.socket.remoteAddress ?? null;
};

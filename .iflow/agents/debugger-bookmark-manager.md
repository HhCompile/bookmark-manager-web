# Bookmark Manager Debugger Configuration

## Project Overview
A React-based bookmark manager with Flask backend that helps users upload, organize, and manage their browser bookmarks.

## Debugging Setup

### Frontend Debugging Configuration

#### 1. React Developer Tools
- Install React DevTools browser extension
- Enable component inspection
- Monitor state and props changes
- Track re-renders and performance

#### 2. VS Code Debugging
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Chrome",
      "type": "pwa-chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}
```

#### 3. Console Debugging Enhancements
Add debug utilities to development environment:
```javascript
// src/utils/debug.js
export const debug = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEBUG]', ...args);
  }
};

export const debugComponent = (componentName, props) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[COMPONENT] ${componentName}`, props);
  }
};
```

### Backend Debugging Configuration

#### 1. Flask Debug Mode
Enable debug mode in development:
```python
# app.py
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=9001)
```

#### 2. Logging Configuration
Add detailed logging:
```python
# app.py
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s %(name)s %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)
```

#### 3. Debug Endpoints
Add debugging endpoints:
```python
# app.py
@app.route('/debug/state')
def debug_state():
    """Debug endpoint to check application state"""
    return jsonify({
        'bookmark_count': len(manager.get_bookmarks()),
        'categories': list(set(b.category for b in manager.get_bookmarks() if b.category)),
        'tags': list(set(tag for b in manager.get_bookmarks() for tag in b.tags)),
        'memory_usage': 'N/A'  # Would need psutil for actual memory usage
    })
```

## Common Debugging Scenarios

### 1. File Upload Issues
**Symptoms**: 
- Upload fails silently
- File not processed
- Incorrect bookmark count

**Debug Steps**:
1. Check browser network tab for request/response
2. Add logging to `upload_bookmark_file` endpoint
3. Verify file is saved correctly
4. Check HTML parsing logic
5. Monitor console for JavaScript errors

**Debug Code**:
```python
@app.route('/bookmark/upload', methods=['POST'])
def upload_bookmark_file():
    logger.debug("Upload request received")
    # ... existing code ...
    logger.debug(f"File saved to: {file_path}")
    # ... existing code ...
    logger.debug(f"Processed {processed_count} bookmarks")
```

### 2. Bookmark Display Problems
**Symptoms**:
- Bookmarks not showing
- Incorrect data display
- Filtering not working

**Debug Steps**:
1. Check API response in browser network tab
2. Add console logs in React components
3. Verify Zustand store updates
4. Check filtering logic

**Debug Code**:
```javascript
// In BookmarkList.jsx
useEffect(() => {
  const fetchBookmarks = async () => {
    console.debug('Fetching bookmarks...');
    try {
      const response = await api.getAllBookmarks();
      console.debug('Bookmarks received:', response.data);
      setBookmarks(response.data.bookmarks);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };
  
  fetchBookmarks();
}, []);
```

### 3. CORS Issues
**Symptoms**:
- API calls failing with CORS errors
- Network requests blocked

**Debug Steps**:
1. Check browser console for CORS errors
2. Verify Vite proxy configuration
3. Check Flask CORS headers
4. Test with curl/postman

**Debug Code**:
```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:9001',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
      configure: (proxy, options) => {
        proxy.on('error', (err, req, res) => {
          console.error('Proxy error:', err);
        });
        proxy.on('proxyRes', (proxyRes, req, res) => {
          console.debug('Proxy response:', proxyRes.statusCode, req.url);
        });
      }
    }
  }
}
```

## Debugging Tools and Extensions

### Browser Extensions
1. **React Developer Tools**: Component inspection
2. **Redux DevTools**: State management (if using Redux)
3. **Lighthouse**: Performance and accessibility
4. **WebPageTest**: Detailed performance analysis

### VS Code Extensions
1. **Debugger for Chrome**: Frontend debugging
2. **Python Debugger**: Backend debugging
3. **ESLint**: Code quality issues
4. **Prettier**: Code formatting

### Command Line Tools
1. **curl**: API testing
2. **httpie**: User-friendly HTTP client
3. **ngrok**: Expose local server for testing
4. **watch**: Monitor file changes

## Debugging Best Practices

### 1. Systematic Approach
1. **Reproduce**: Consistently reproduce the issue
2. **Isolate**: Narrow down the problem area
3. **Hypothesize**: Formulate possible causes
4. **Test**: Verify hypotheses with experiments
5. **Fix**: Implement and verify the solution
6. **Prevent**: Add tests to prevent regression

### 2. Logging Strategy
- Use appropriate log levels (debug, info, warn, error)
- Include contextual information
- Avoid logging sensitive data
- Use structured logging where possible
- Correlate logs across services

### 3. Error Handling
- Catch and log all exceptions
- Provide meaningful error messages
- Include stack traces in development
- Implement graceful degradation
- Use error boundaries in React

## Debugging Checklist

### Before Debugging
- [ ] Reproduce the issue consistently
- [ ] Check recent code changes
- [ ] Verify environment setup
- [ ] Ensure all services are running
- [ ] Check browser console/network tabs

### During Debugging
- [ ] Add temporary debug logs
- [ ] Use browser dev tools
- [ ] Check API responses
- [ ] Verify data flow
- [ ] Test edge cases

### After Debugging
- [ ] Remove debug code
- [ ] Add permanent logging if needed
- [ ] Write tests to prevent regression
- [ ] Document the issue and solution
- [ ] Verify fix in different environments

## Common Pitfalls to Avoid

1. **Over-debugging**: Adding too many logs can obscure the real issue
2. **Assuming**: Making assumptions about the root cause
3. **Ignoring**: Dismissing "impossible" causes
4. **Rushing**: Not taking time to understand the problem fully
5. **Silent failures**: Not handling or logging errors properly

## Success Metrics

- Issues resolved within 2 hours of discovery
- 90%+ first-time fix rate
- Zero production debugging sessions
- Comprehensive test coverage for fixed issues
- Improved documentation from debugging findings
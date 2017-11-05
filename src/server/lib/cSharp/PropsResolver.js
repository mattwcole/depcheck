import parseXml from '../xmlParser';

export default class PropsResolver {
  constructor(owner, repo, gitHubClient) {
    this.owner = owner;
    this.repo = repo;
    this.gitHubClient = gitHubClient;
  }

  async getProps() {
    const propsFiles = await this.gitHubClient.getFilesContent(this.owner, this.repo, '*.props');

    const props = {};
    await Promise.all(propsFiles.map(async (propFile) => {
      const propFileContent = await parseXml(propFile.content);

      if (propFileContent.Project.PropertyGroup) {
        propFileContent.Project.PropertyGroup.forEach((propertyGroup) => {
          Object.entries(propertyGroup).forEach((propEntry) => {
            // eslint-disable-next-line no-param-reassign
            props[propEntry[0]] = propEntry[1][0];
          });
        });
      }
    }));

    return props;
  }

  async getValue(prop) {
    if (!this.propsPromise) {
      this.propsPromise = this.getProps();
    }

    const props = await this.propsPromise;
    return props[prop] || prop;
  }
}
